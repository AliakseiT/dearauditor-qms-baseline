interface Env {
  PUBLIC_BASE_URL: string;
  DEFAULT_OAUTH_PROVIDER?: string;
  ALLOWED_OAUTH_PROVIDERS?: string;
  GITHUB_OAUTH_CLIENT_ID: string;
  GITHUB_OAUTH_CLIENT_SECRET: string;
  GITHUB_REPO_TOKEN: string;
  SIGNATURE_LINK_SECRET: string;
  SIGNATURE_STATE_SECRET: string;
  PIN_PEPPER: string;
  GITHUB_API_BASE_URL?: string;
  PIN_KV: KVNamespace;
}

interface SignatureContext {
  repo: string;
  pr: string;
  hash: string;
  meaning: string;
  role: string;
  signer: string;
  required_signatures: string;
  signature_index: string;
  exp: string;
}

interface OAuthState {
  type: "oauth";
  provider: string;
  ctx: SignatureContext;
  iat: number;
  exp_state: number;
  nonce: string;
}

interface PinSessionState {
  type: "pin_session";
  full_name: string;
  ctx: SignatureContext;
  signer_login: string;
  signer_id: number;
  signer_job_title: string;
  request_comment_id: number;
  request_comment_url: string;
  auth_method: string;
  iat: number;
  exp_state: number;
  nonce: string;
}

interface GithubUser {
  login: string;
  id: number;
  name?: string | null;
}

interface SignatureRequestMeta {
  commentId: number;
  commentUrl: string;
  hash: string;
  meaning: string;
  roles: string[];
  eligibleSigners: string[];
}

interface PinRecord {
  version: "2";
  github_user_id: number;
  github_login: string;
  pin_kdf: "PBKDF2-SHA256";
  pin_iterations: number;
  pin_salt_hex: string;
  pin_hash_hex: string;
  created_at_epoch: number;
  expires_at_epoch: number;
}

interface PinStatus {
  active: boolean;
  expiringSoon: boolean;
  expiresAtEpoch: number | null;
  createdAtEpoch: number | null;
  record: PinRecord | null;
  missingOrExpired: boolean;
}

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const HTML_HEADERS = { "content-type": "text/html; charset=utf-8" };
const PIN_TTL_SECONDS = 5184000; // 60 days
const PIN_WARNING_SECONDS = 7 * 24 * 60 * 60; // 7 days
const PIN_KDF_ITERATIONS = 140000;
const PIN_SALT_BYTES = 16;
const PIN_EXPLANATION_TEXT =
  "This 6-digit PIN acts as your secure electronic signature component for the Quality Management System, ensuring your approvals meet strict regulatory and FDA compliance standards without forcing you to re-authenticate with GitHub for every single signature.";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path === "/healthz") {
        return json({ ok: true, service: "signature-worker" });
      }
      if (path === "/") {
        return Response.redirect(`${stripTrailingSlash(env.PUBLIC_BASE_URL || url.origin)}/healthz`, 302);
      }
      if (path === "/sign" && request.method === "GET") {
        return handleSignPage(request, env);
      }
      if (path === "/auth/start" && request.method === "POST") {
        return handleAuthStart(request, env);
      }
      if (path === "/auth/callback" && request.method === "GET") {
        return handleAuthCallback(request, env);
      }
      if (path === "/pin/complete" && request.method === "POST") {
        return handlePinComplete(request, env);
      }
      if (path === "/pin/setup" && request.method === "POST") {
        return handlePinSetup(request, env);
      }
      if (path === "/api/pin/status" && request.method === "POST") {
        return handlePinStatusApi(request, env);
      }

      return html(renderErrorPage("Not Found", "Unknown route."), 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return html(renderErrorPage("Signature Worker Error", message), 500);
    }
  },
};

async function handleSignPage(request: Request, env: Env): Promise<Response> {
  assertBaseConfig(env);

  const url = new URL(request.url);
  const provider = resolveProvider(
    (url.searchParams.get("provider") || env.DEFAULT_OAUTH_PROVIDER || "github").toLowerCase(),
    env
  );

  const context = parseContextFromParams(url.searchParams);
  const signature = (url.searchParams.get("sig") || "").trim();
  await assertValidSignedContext(context, signature, env.SIGNATURE_LINK_SECRET);

  return html(renderSignPage(context, provider, env.PUBLIC_BASE_URL, signature), 200);
}

async function handleAuthStart(request: Request, env: Env): Promise<Response> {
  assertBaseConfig(env);
  const form = await request.formData();

  const provider = resolveProvider(
    String(form.get("provider") || env.DEFAULT_OAUTH_PROVIDER || "github").toLowerCase(),
    env
  );

  const context = contextFromFormData(form);
  const signature = String(form.get("sig") || "").trim();
  await assertValidSignedContext(context, signature, env.SIGNATURE_LINK_SECRET);

  const state: OAuthState = {
    type: "oauth",
    provider,
    ctx: context,
    iat: nowEpoch(),
    exp_state: nowEpoch() + 10 * 60,
    nonce: randomHex(12),
  };
  const stateToken = await signToken(state, env.SIGNATURE_STATE_SECRET);

  if (provider === "github") {
    const redirect = new URL("https://github.com/login/oauth/authorize");
    redirect.searchParams.set("client_id", env.GITHUB_OAUTH_CLIENT_ID);
    redirect.searchParams.set("redirect_uri", `${stripTrailingSlash(env.PUBLIC_BASE_URL)}/auth/callback`);
    redirect.searchParams.set("state", stateToken);
    redirect.searchParams.set("scope", "read:user");
    redirect.searchParams.set("allow_signup", "false");
    return Response.redirect(redirect.toString(), 302);
  }

  throw new Error(`Provider '${provider}' is not implemented.`);
}

async function handleAuthCallback(request: Request, env: Env): Promise<Response> {
  assertBaseConfig(env);

  const url = new URL(request.url);
  const code = (url.searchParams.get("code") || "").trim();
  const stateToken = (url.searchParams.get("state") || "").trim();
  const apiMode = url.searchParams.get("format") === "json";
  if (!code || !stateToken) {
    throw new Error("Missing OAuth callback parameters.");
  }

  const state = (await verifyToken(stateToken, env.SIGNATURE_STATE_SECRET)) as OAuthState;
  if (state.type !== "oauth") {
    throw new Error("Invalid OAuth state payload.");
  }
  if (state.exp_state < nowEpoch()) {
    throw new Error("Sign session expired. Open your PR signing link again.");
  }
  if (state.provider !== "github") {
    throw new Error(`Provider '${state.provider}' is not implemented.`);
  }

  const userToken = await exchangeGithubCode(code, env);
  const user = await githubGet<GithubUser>("/user", userToken, env);
  const signerLogin = String(user.login || "").toLowerCase();
  if (!signerLogin) {
    throw new Error("Unable to resolve GitHub user login.");
  }

  if (signerLogin !== state.ctx.signer.toLowerCase()) {
    throw new Error(
      `This link is assigned to @${state.ctx.signer}. You are signed in as @${signerLogin}.`
    );
  }

  const repoToken = env.GITHUB_REPO_TOKEN;
  const requestMeta = await resolveLatestRequestComment(state.ctx.repo, Number.parseInt(state.ctx.pr, 10), repoToken, env);
  validateRequestAgainstContext(requestMeta, state.ctx);

  const signerProfile = await readSignerProfile(state.ctx.repo, signerLogin, repoToken, env);
  const registryFullName = String(signerProfile.full_name || "").trim();
  if (!registryFullName) {
    throw new Error(
      `Missing full_name for @${signerLogin} in matrices/signer_registry.json. Signature cannot proceed.`
    );
  }

  const duplicate = await findExistingAttestation(state.ctx, signerLogin, repoToken, env);
  if (duplicate) {
    return html(renderSuccessPage({
      repo: state.ctx.repo,
      pr: state.ctx.pr,
      hash: state.ctx.hash,
      meaning: state.ctx.meaning,
      role: state.ctx.role,
      signer: signerLogin,
      signerFullName: registryFullName,
      timestamp: new Date().toISOString(),
      attestationId: duplicate.attestation_id,
      alreadySigned: true,
      pinExpiringSoon: false,
    }), 200);
  }

  const pinStatus = await getPinStatus(env, Number(user.id || 0), signerLogin);
  const sessionState: PinSessionState = {
    type: "pin_session",
    full_name: registryFullName,
    ctx: state.ctx,
    signer_login: signerLogin,
    signer_id: Number(user.id || 0),
    signer_job_title: String(signerProfile.job_title || "").trim(),
    request_comment_id: requestMeta.commentId,
    request_comment_url: requestMeta.commentUrl,
    auth_method: "GitHub OAuth App (identity) + QMS PIN",
    iat: nowEpoch(),
    exp_state: nowEpoch() + 10 * 60,
    nonce: randomHex(12),
  };
  const sessionToken = await signToken(sessionState, env.SIGNATURE_STATE_SECRET);

  if (apiMode || wantsJson(request)) {
    return json({
      ok: true,
      requires_pin_setup: !pinStatus.active,
      pin_missing_or_expired: pinStatus.missingOrExpired,
      pin_expiring_soon: pinStatus.expiringSoon,
      pin_expires_at_epoch: pinStatus.expiresAtEpoch,
      pin_policy: {
        ttl_seconds: PIN_TTL_SECONDS,
        warning_window_seconds: PIN_WARNING_SECONDS,
      },
      qms_pin_explanation: PIN_EXPLANATION_TEXT,
      session_token: sessionToken,
    });
  }

  if (!pinStatus.active) {
    return html(renderPinSetupPage(sessionState, sessionToken), 200);
  }
  return html(renderPinVerifyPage(sessionState, sessionToken, pinStatus.expiringSoon, pinStatus.expiresAtEpoch), 200);
}

async function handlePinComplete(request: Request, env: Env): Promise<Response> {
  assertBaseConfig(env);
  const form = await request.formData();

  const sessionToken = String(form.get("session_token") || "").trim();
  const mode = String(form.get("mode") || "verify").trim().toLowerCase();
  const pin = String(form.get("pin") || "").trim();
  const pinConfirm = String(form.get("pin_confirm") || "").trim();
  const responseFormat = String(form.get("response_format") || "").trim().toLowerCase();

  if (!sessionToken) {
    throw new Error("Missing signature PIN session token.");
  }

  const session = (await verifyToken(sessionToken, env.SIGNATURE_STATE_SECRET)) as PinSessionState;
  if (session.type !== "pin_session") {
    throw new Error("Invalid PIN session token.");
  }
  if (session.exp_state < nowEpoch()) {
    throw new Error("PIN session expired. Restart signing from the PR link.");
  }

  const pinStatusBefore = await getPinStatus(env, session.signer_id, session.signer_login);
  const setupRequired = !pinStatusBefore.active;

  if (!/^\d{6}$/.test(pin)) {
    throw new Error("PIN must be exactly 6 digits.");
  }

  if (setupRequired || mode === "setup") {
    if (!/^\d{6}$/.test(pinConfirm)) {
      throw new Error("PIN confirmation must be exactly 6 digits.");
    }
    if (pin !== pinConfirm) {
      throw new Error("PIN and confirmation do not match.");
    }
    await writePinRecord(env, session.signer_id, session.signer_login, pin);
  } else {
    if (!pinStatusBefore.record) {
      throw new Error("PIN record not found. Please set up a new PIN.");
    }
    const inputHash = await pbkdf2Sha256Hex(
      pinMaterial(pin, env.PIN_PEPPER),
      pinStatusBefore.record.pin_salt_hex,
      pinStatusBefore.record.pin_iterations
    );
    if (!timingSafeEqual(inputHash, pinStatusBefore.record.pin_hash_hex)) {
      throw new Error("Invalid PIN.");
    }
  }

  const pinStatusAfter = await getPinStatus(env, session.signer_id, session.signer_login);

  const duplicate = await findExistingAttestation(session.ctx, session.signer_login, env.GITHUB_REPO_TOKEN, env);
  let attestationId = duplicate?.attestation_id || "";
  let timestamp = new Date().toISOString();
  let alreadySigned = Boolean(duplicate);

  if (!duplicate) {
    const attestation = {
      version: "PART11-CF-WORKER-V2",
      mode: "cloudflare_worker_github_oauth_pin",
      repository: session.ctx.repo,
      pr_number: Number.parseInt(session.ctx.pr, 10),
      commit_hash: session.ctx.hash,
      meaning_of_signature: session.ctx.meaning,
      signer_role: session.ctx.role,
      signer_full_name: session.full_name,
      signer_job_title: session.signer_job_title || "",
      user_id: session.signer_login,
      actor_id: Number(session.signer_id || 0),
      timestamp,
      attestation_id: randomHex(16),
      required_signatures: Number.parseInt(session.ctx.required_signatures, 10),
      signature_index: Number.parseInt(session.ctx.signature_index, 10),
      request_comment_id: session.request_comment_id,
      request_comment_url: session.request_comment_url,
      auth_method: session.auth_method,
      pin_verified: true,
      pin_expiring_soon: pinStatusAfter.expiringSoon,
      linked_to_record: {
        type: "pull_request",
        number: Number.parseInt(session.ctx.pr, 10),
        repo: session.ctx.repo,
        hash: session.ctx.hash,
      },
    };
    attestationId = attestation.attestation_id;

    const body = [
      "<!-- SIGNATURE_ATTESTATION_V1 -->",
      "```json",
      JSON.stringify(attestation, null, 2),
      "```",
    ].join("\n");

    await githubPost(
      `/repos/${session.ctx.repo}/issues/${session.ctx.pr}/comments`,
      env.GITHUB_REPO_TOKEN,
      { body },
      env
    );
  }

  const wantsJsonResponse = responseFormat === "json" || wantsJson(request);
  if (wantsJsonResponse) {
    return json({
      ok: true,
      already_signed: alreadySigned,
      attestation_id: attestationId,
      pin_expiring_soon: pinStatusAfter.expiringSoon,
      pin_expires_at_epoch: pinStatusAfter.expiresAtEpoch,
      pin_policy: {
        ttl_seconds: PIN_TTL_SECONDS,
        warning_window_seconds: PIN_WARNING_SECONDS,
      },
      pr_number: Number.parseInt(session.ctx.pr, 10),
      repository: session.ctx.repo,
      signer: session.signer_login,
      timestamp,
    });
  }

  return html(renderSuccessPage({
    repo: session.ctx.repo,
    pr: session.ctx.pr,
    hash: session.ctx.hash,
    meaning: session.ctx.meaning,
    role: session.ctx.role,
    signer: session.signer_login,
    signerFullName: session.full_name,
    timestamp,
    attestationId,
    alreadySigned,
    pinExpiringSoon: pinStatusAfter.expiringSoon,
  }), 200);
}

async function handlePinSetup(request: Request, env: Env): Promise<Response> {
  assertBaseConfig(env);
  const form = await request.formData();
  const sessionToken = String(form.get("session_token") || "").trim();
  if (!sessionToken) {
    throw new Error("Missing signature PIN session token.");
  }
  const session = (await verifyToken(sessionToken, env.SIGNATURE_STATE_SECRET)) as PinSessionState;
  if (session.type !== "pin_session") {
    throw new Error("Invalid PIN session token.");
  }
  if (session.exp_state < nowEpoch()) {
    throw new Error("PIN session expired. Restart signing from the PR link.");
  }
  return html(renderPinSetupPage(session, sessionToken), 200);
}

async function handlePinStatusApi(request: Request, env: Env): Promise<Response> {
  assertBaseConfig(env);
  const contentType = request.headers.get("content-type") || "";
  let sessionToken = "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { session_token?: string };
    sessionToken = String(body.session_token || "").trim();
  } else {
    const form = await request.formData();
    sessionToken = String(form.get("session_token") || "").trim();
  }

  if (!sessionToken) {
    return json({ ok: false, error: "missing_session_token" }, 400);
  }

  const session = (await verifyToken(sessionToken, env.SIGNATURE_STATE_SECRET)) as PinSessionState;
  if (session.type !== "pin_session") {
    return json({ ok: false, error: "invalid_session_token" }, 400);
  }

  const pinStatus = await getPinStatus(env, session.signer_id, session.signer_login);
  return json({
    ok: true,
    requires_pin_setup: !pinStatus.active,
    pin_missing_or_expired: pinStatus.missingOrExpired,
    pin_expiring_soon: pinStatus.expiringSoon,
    pin_expires_at_epoch: pinStatus.expiresAtEpoch,
    pin_policy: {
      ttl_seconds: PIN_TTL_SECONDS,
      warning_window_seconds: PIN_WARNING_SECONDS,
    },
    qms_pin_explanation: PIN_EXPLANATION_TEXT,
  });
}

function assertBaseConfig(env: Env): void {
  const required = [
    "PUBLIC_BASE_URL",
    "GITHUB_OAUTH_CLIENT_ID",
    "GITHUB_OAUTH_CLIENT_SECRET",
    "GITHUB_REPO_TOKEN",
    "SIGNATURE_LINK_SECRET",
    "SIGNATURE_STATE_SECRET",
    "PIN_PEPPER",
  ] as const;
  for (const key of required) {
    const value = String(env[key] || "").trim();
    if (!value) {
      throw new Error(`Missing required configuration: ${key}`);
    }
  }
  if (!env.PIN_KV) {
    throw new Error("Missing required KV binding: PIN_KV");
  }
}

function resolveProvider(provider: string, env: Env): string {
  const allowed = String(env.ALLOWED_OAUTH_PROVIDERS || "github")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
  if (!allowed.includes(provider)) {
    throw new Error(`OAuth provider '${provider}' is not allowed.`);
  }
  return provider;
}

function parseContextFromParams(params: URLSearchParams): SignatureContext {
  return {
    repo: (params.get("repo") || "").trim(),
    pr: (params.get("pr") || "").trim(),
    hash: (params.get("hash") || "").trim().toLowerCase(),
    meaning: (params.get("meaning") || "").trim(),
    role: (params.get("role") || "").trim(),
    signer: (params.get("signer") || "").trim().toLowerCase(),
    required_signatures: (params.get("required_signatures") || "1").trim(),
    signature_index: (params.get("signature_index") || "1").trim(),
    exp: (params.get("exp") || "").trim(),
  };
}

function contextFromFormData(form: FormData): SignatureContext {
  return {
    repo: String(form.get("repo") || "").trim(),
    pr: String(form.get("pr") || "").trim(),
    hash: String(form.get("hash") || "").trim().toLowerCase(),
    meaning: String(form.get("meaning") || "").trim(),
    role: String(form.get("role") || "").trim(),
    signer: String(form.get("signer") || "").trim().toLowerCase(),
    required_signatures: String(form.get("required_signatures") || "1").trim(),
    signature_index: String(form.get("signature_index") || "1").trim(),
    exp: String(form.get("exp") || "").trim(),
  };
}

async function assertValidSignedContext(ctx: SignatureContext, sig: string, secret: string): Promise<void> {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(ctx.repo)) throw new Error("Invalid repository.");
  if (!/^\d+$/.test(ctx.pr)) throw new Error("Invalid PR number.");
  if (!/^[a-f0-9]{64}$/.test(ctx.hash)) throw new Error("Invalid target hash.");
  if (!ctx.meaning) throw new Error("Missing meaning of signature.");
  if (!ctx.role) throw new Error("Missing signer role.");
  if (!/^[A-Za-z0-9-]+$/.test(ctx.signer)) throw new Error("Invalid signer login.");
  if (!/^\d+$/.test(ctx.exp)) throw new Error("Invalid expiry.");
  if (!/^[a-f0-9]{64}$/.test(sig.toLowerCase())) throw new Error("Invalid signature token.");

  const exp = Number.parseInt(ctx.exp, 10);
  if (!Number.isFinite(exp) || exp < nowEpoch()) {
    throw new Error("Signing link expired.");
  }

  const canonical = canonicalString({
    exp: ctx.exp,
    hash: ctx.hash,
    meaning: ctx.meaning,
    pr: ctx.pr,
    repo: ctx.repo,
    required_signatures: ctx.required_signatures,
    role: ctx.role,
    signature_index: ctx.signature_index,
    signer: ctx.signer,
  });

  const expected = await hmacHexAsync(canonical, secret);
  if (!timingSafeEqual(expected, sig.toLowerCase())) {
    throw new Error("Invalid signed link payload.");
  }
}

function canonicalString(map: Record<string, string>): string {
  return Object.keys(map)
    .sort()
    .map((k) => `${k}=${map[k]}`)
    .join("&");
}

async function signToken(payload: OAuthState | PinSessionState, secret: string): Promise<string> {
  const encoded = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await hmacHexAsync(encoded, secret);
  return `${encoded}.${signature}`;
}

async function verifyToken(token: string, secret: string): Promise<OAuthState | PinSessionState> {
  const parts = token.split(".");
  if (parts.length !== 2) throw new Error("Invalid token.");
  const [encoded, sig] = parts;
  const expected = await hmacHexAsync(encoded, secret);
  if (!timingSafeEqual(expected, sig.toLowerCase())) {
    throw new Error("Invalid token signature.");
  }
  let bytes: Uint8Array;
  try {
    bytes = base64UrlDecode(encoded);
  } catch {
    throw new Error("Invalid token encoding.");
  }
  let parsed: OAuthState | PinSessionState;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes)) as OAuthState | PinSessionState;
  } catch {
    throw new Error("Invalid token payload.");
  }
  if (!parsed || typeof parsed !== "object" || !("type" in parsed) || !("ctx" in parsed)) {
    throw new Error("Invalid token payload.");
  }
  return parsed;
}

async function exchangeGithubCode(code: string, env: Env): Promise<string> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: `${stripTrailingSlash(env.PUBLIC_BASE_URL)}/auth/callback`,
    }),
  });

  const payload = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!res.ok || !payload.access_token) {
    throw new Error(
      `GitHub OAuth exchange failed: ${payload.error || res.statusText}${
        payload.error_description ? ` (${payload.error_description})` : ""
      }`
    );
  }
  return payload.access_token;
}

async function resolveLatestRequestComment(repo: string, prNumber: number, token: string, env: Env): Promise<SignatureRequestMeta> {
  const comments = await githubGet<Array<{ id: number; html_url: string; body?: string; created_at?: string }>>(
    `/repos/${repo}/issues/${prNumber}/comments?per_page=100`,
    token,
    env
  );

  const requestComments = comments
    .filter((c) => {
      const body = c.body || "";
      return body.includes("<!-- signature-native-signature-request -->") || body.includes("<!-- part11-native-signature-request -->");
    })
    .sort((a, b) => Date.parse(a.created_at || "") - Date.parse(b.created_at || ""));
  if (requestComments.length === 0) {
    throw new Error(`No signature request comment found on PR #${prNumber}.`);
  }

  const latest = requestComments[requestComments.length - 1];
  const body = latest.body || "";

  const hash = extractOne(body, /Target hash \(merge state\):\s*`([a-f0-9]{64})`/i, "target hash");
  const meaning = extractOne(body, /Meaning of signature:\s*\*\*([^*]+)\*\*/i, "meaning of signature");
  const rolesRaw = extractOne(body, /Designated signatory role\(s\):\s*\*\*([^*]+)\*\*/i, "signer roles");
  const eligibleRaw = extractOne(body, /Eligible signers:\s*\*\*([^*]+)\*\*/i, "eligible signers");

  const roles = rolesRaw
    .split(/[;,]/)
    .map((x) => x.trim())
    .filter(Boolean);
  const eligibleSigners = Array.from(eligibleRaw.matchAll(/@([A-Za-z0-9-]+)/g)).map((m) => m[1].toLowerCase());

  return {
    commentId: Number(latest.id),
    commentUrl: String(latest.html_url || ""),
    hash,
    meaning,
    roles,
    eligibleSigners,
  };
}

function validateRequestAgainstContext(meta: SignatureRequestMeta, ctx: SignatureContext): void {
  if (meta.hash !== ctx.hash) {
    const expected = `${ctx.hash.slice(0, 12)}...`;
    const actual = `${meta.hash.slice(0, 12)}...`;
    const requestUrl = meta.commentUrl ? ` Open latest signature request: ${meta.commentUrl}` : "";
    throw new Error(
      `Signing link is stale (hash mismatch). Link hash ${expected} does not match current request hash ${actual}.${requestUrl}`
    );
  }
  if (meta.meaning !== ctx.meaning) {
    throw new Error("Meaning-of-signature mismatch with latest request comment.");
  }
  const roleLower = ctx.role.toLowerCase();
  if (meta.roles.length > 0 && !meta.roles.map((x) => x.toLowerCase()).includes(roleLower)) {
    throw new Error(`Role '${ctx.role}' is not allowed in current request.`);
  }
  const signerLower = ctx.signer.toLowerCase();
  if (meta.eligibleSigners.length > 0 && !meta.eligibleSigners.includes(signerLower)) {
    throw new Error(`Signer @${ctx.signer} is not eligible for this request.`);
  }
}

async function readSignerProfile(repo: string, login: string, token: string, env: Env): Promise<{ full_name?: string; job_title?: string }> {
  try {
    const data = await githubGet<{ content?: string; encoding?: string }>(
      `/repos/${repo}/contents/matrices/signer_registry.json`,
      token,
      env
    );
    if (!data.content) return {};
    const raw = data.encoding === "base64" ? decodeBase64(data.content) : data.content;
    const parsed = JSON.parse(raw) as Record<string, { full_name?: string; job_title?: string }>;
    const match = Object.entries(parsed).find(([k]) => k.toLowerCase() === login.toLowerCase());
    return match ? match[1] || {} : {};
  } catch {
    return {};
  }
}

async function findExistingAttestation(ctx: SignatureContext, signer: string, token: string, env: Env): Promise<{ attestation_id: string } | null> {
  const comments = await githubGet<Array<{ body?: string }>>(
    `/repos/${ctx.repo}/issues/${ctx.pr}/comments?per_page=100`,
    token,
    env
  );

  for (const c of comments) {
    const body = c.body || "";
    if (!body.includes("<!-- SIGNATURE_ATTESTATION_V1 -->") && !body.includes("<!-- PART11_ATTESTATION_V1 -->")) continue;
    const match = body.match(/```json\s*([\s\S]*?)```/i);
    if (!match || !match[1]) continue;
    try {
      const parsed = JSON.parse(match[1]);
      if (
        String(parsed.pr_number) === ctx.pr &&
        String(parsed.commit_hash || "").toLowerCase() === ctx.hash.toLowerCase() &&
        String(parsed.meaning_of_signature || "") === ctx.meaning &&
        String(parsed.signer_role || "").toLowerCase() === ctx.role.toLowerCase() &&
        String(parsed.user_id || "").toLowerCase() === signer.toLowerCase()
      ) {
        return { attestation_id: String(parsed.attestation_id || "") };
      }
    } catch {
      continue;
    }
  }

  return null;
}

async function getPinStatus(env: Env, githubUserId: number, githubLogin: string): Promise<PinStatus> {
  if (!Number.isFinite(githubUserId) || githubUserId < 1) {
    throw new Error("Unable to resolve GitHub user ID for PIN lookup.");
  }
  const raw = await env.PIN_KV.get(pinKvKey(githubUserId));
  if (!raw) {
    return {
      active: false,
      expiringSoon: false,
      expiresAtEpoch: null,
      createdAtEpoch: null,
      record: null,
      missingOrExpired: true,
    };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    await env.PIN_KV.delete(pinKvKey(githubUserId));
    return {
      active: false,
      expiringSoon: false,
      expiresAtEpoch: null,
      createdAtEpoch: null,
      record: null,
      missingOrExpired: true,
    };
  }

  const now = nowEpoch();
  if (
    parsed.version !== "2" ||
    parsed.pin_kdf !== "PBKDF2-SHA256" ||
    !Number.isInteger(parsed.pin_iterations) ||
    parsed.pin_iterations < 100000 ||
    !/^[a-f0-9]{32,128}$/i.test(String(parsed.pin_salt_hex || "")) ||
    String(parsed.pin_salt_hex || "").length % 2 !== 0 ||
    !/^[a-f0-9]{64}$/i.test(String(parsed.pin_hash_hex || "")) ||
    !Number.isFinite(parsed.created_at_epoch) ||
    !Number.isFinite(parsed.expires_at_epoch) ||
    Number(parsed.github_user_id) !== githubUserId ||
    String(parsed.github_login || "").toLowerCase() !== String(githubLogin || "").toLowerCase() ||
    parsed.expires_at_epoch <= now
  ) {
    await env.PIN_KV.delete(pinKvKey(githubUserId));
    return {
      active: false,
      expiringSoon: false,
      expiresAtEpoch: null,
      createdAtEpoch: null,
      record: null,
      missingOrExpired: true,
    };
  }

  const record: PinRecord = {
    version: "2",
    github_user_id: Number(parsed.github_user_id),
    github_login: String(parsed.github_login || ""),
    pin_kdf: "PBKDF2-SHA256",
    pin_iterations: Number(parsed.pin_iterations),
    pin_salt_hex: String(parsed.pin_salt_hex || "").toLowerCase(),
    pin_hash_hex: String(parsed.pin_hash_hex || "").toLowerCase(),
    created_at_epoch: Number(parsed.created_at_epoch),
    expires_at_epoch: Number(parsed.expires_at_epoch),
  };

  const secondsToExpiry = parsed.expires_at_epoch - now;
  return {
    active: true,
    expiringSoon: secondsToExpiry < PIN_WARNING_SECONDS,
    expiresAtEpoch: parsed.expires_at_epoch,
    createdAtEpoch: parsed.created_at_epoch,
    record,
    missingOrExpired: false,
  };
}

async function writePinRecord(env: Env, githubUserId: number, githubLogin: string, pin: string): Promise<void> {
  if (!/^\d{6}$/.test(pin)) {
    throw new Error("PIN must be exactly 6 digits.");
  }
  const createdAt = nowEpoch();
  const saltHex = randomHex(PIN_SALT_BYTES);
  const payload: PinRecord = {
    version: "2",
    github_user_id: githubUserId,
    github_login: githubLogin,
    pin_kdf: "PBKDF2-SHA256",
    pin_iterations: PIN_KDF_ITERATIONS,
    pin_salt_hex: saltHex,
    pin_hash_hex: await pbkdf2Sha256Hex(pinMaterial(pin, env.PIN_PEPPER), saltHex, PIN_KDF_ITERATIONS),
    created_at_epoch: createdAt,
    expires_at_epoch: createdAt + PIN_TTL_SECONDS,
  };
  await env.PIN_KV.put(pinKvKey(githubUserId), JSON.stringify(payload), {
    expirationTtl: PIN_TTL_SECONDS,
  });
}

function pinMaterial(pin: string, pepper: string): string {
  const p = String(pepper || "").trim();
  return p ? `${pin}:${p}` : pin;
}

async function pbkdf2Sha256Hex(value: string, saltHex: string, iterations: number): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(value),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: hexToBytes(saltHex),
      iterations,
    },
    keyMaterial,
    256
  );
  return bytesToHex(new Uint8Array(bits));
}

function pinKvKey(githubUserId: number): string {
  return `pin:v1:gh:${githubUserId}`;
}

async function githubGet<T>(path: string, token: string, env: Env): Promise<T> {
  const res = await fetch(`${githubApiBase(env)}${path}`, {
    method: "GET",
    headers: githubHeaders(token),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API GET ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

async function githubPost<T>(path: string, token: string, payload: unknown, env: Env): Promise<T> {
  const res = await fetch(`${githubApiBase(env)}${path}`, {
    method: "POST",
    headers: {
      ...githubHeaders(token),
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API POST ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

function githubHeaders(token: string): Record<string, string> {
  return {
    authorization: `token ${token}`,
    accept: "application/vnd.github+json",
    "user-agent": "qms-lite-signature-worker",
    "x-github-api-version": "2022-11-28",
  };
}

function githubApiBase(env: Env): string {
  return stripTrailingSlash(env.GITHUB_API_BASE_URL || "https://api.github.com");
}

function extractOne(body: string, re: RegExp, label: string): string {
  const match = body.match(re);
  if (!match || !match[1]) throw new Error(`Could not parse ${label} from request comment.`);
  return match[1].trim();
}

async function hmacHexAsync(data: string, secret: string): Promise<string> {
  const keyData = new TextEncoder().encode(secret);
  const dataBytes = new TextEncoder().encode(data);
  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, dataBytes);
  return bytesToHex(new Uint8Array(sig));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex length.");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    out[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return out;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return base64ToBytes(padded);
}

function decodeBase64(value: string): string {
  return new TextDecoder().decode(base64ToBytes(value.replace(/\n/g, "")));
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function nowEpoch(): number {
  return Math.floor(Date.now() / 1000);
}

function randomHex(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return bytesToHex(arr);
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/g, "");
}

function wantsJson(request: Request): boolean {
  const accept = String(request.headers.get("accept") || "").toLowerCase();
  return accept.includes("application/json");
}

function html(content: string, status = 200): Response {
  return new Response(content, { status, headers: HTML_HEADERS });
}

function json(content: unknown, status = 200): Response {
  return new Response(JSON.stringify(content), { status, headers: JSON_HEADERS });
}

function renderSignPage(ctx: SignatureContext, provider: string, baseUrl: string, sig: string): string {
  const title = "QMS Lite Sign";
  const providerLabel = provider === "github" ? "GitHub" : provider;
  const formAction = `${stripTrailingSlash(baseUrl)}/auth/start`;
  const prUrl = `https://github.com/${ctx.repo}/pull/${ctx.pr}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --bg: #f6f8fb;
      --card: #ffffff;
      --ink: #13203a;
      --muted: #4b5a7a;
      --line: #d5dced;
      --action: #0f3d7a;
      --action-ink: #ffffff;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: linear-gradient(145deg,#f2f6ff,#f8fafc 50%,#eef3ff); color: var(--ink); font: 16px/1.45 "Segoe UI", "Avenir Next", "Helvetica Neue", sans-serif; }
    .wrap { max-width: 880px; margin: 28px auto; padding: 0 18px; }
    .card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 14px 40px rgba(17,39,84,.08); overflow: hidden; }
    .head { background: #12213d; color: #f7faff; padding: 18px 20px; }
    .head h1 { margin: 0 0 4px; font-size: 25px; font-weight: 700; }
    .head p { margin: 0; color: #dce7ff; }
    .section { padding: 18px 20px; border-top: 1px solid var(--line); }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .k { font-size: 12px; text-transform: uppercase; color: var(--muted); letter-spacing: .04em; }
    .v { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; background: #f4f7fe; border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; }
    label { display: block; font-weight: 650; margin-bottom: 8px; }
    input[type="text"] { width: 100%; padding: 12px; border: 1px solid #b8c6e2; border-radius: 10px; font-size: 16px; }
    .hint { margin-top: 6px; color: var(--muted); font-size: 13px; }
    .btn { margin-top: 14px; border: none; border-radius: 10px; padding: 12px 16px; font-size: 15px; font-weight: 650; background: var(--action); color: var(--action-ink); cursor: pointer; }
    .btn:hover { filter: brightness(1.08); }
    .btn[disabled] { opacity: .68; cursor: not-allowed; filter: none; }
    .foot { font-size: 12px; color: var(--muted); }
    a { color: #1b4ea4; }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <h1>QMS Signature Ceremony</h1>
        <p>Identity is your active ${escapeHtml(providerLabel)} login, signature context is locked from the PR request, PIN is verified next.</p>
      </div>
      <div class="section">
        <div class="grid">
          <div><div class="k">Repository</div><div class="v">${escapeHtml(ctx.repo)}</div></div>
          <div><div class="k">PR Number</div><div class="v">${escapeHtml(ctx.pr)}</div></div>
          <div><div class="k">Target Hash</div><div class="v">${escapeHtml(ctx.hash)}</div></div>
          <div><div class="k">Meaning of Signature</div><div class="v">${escapeHtml(ctx.meaning)}</div></div>
          <div><div class="k">Signer Role</div><div class="v">${escapeHtml(ctx.role)}</div></div>
          <div><div class="k">Designated Signer</div><div class="v">@${escapeHtml(ctx.signer)}</div></div>
        </div>
      </div>
      <div class="section">
        <form action="${escapeHtml(formAction)}" method="post" data-submit-guard="1">
          <input type="hidden" name="provider" value="${escapeHtml(provider)}" />
          <input type="hidden" name="repo" value="${escapeHtml(ctx.repo)}" />
          <input type="hidden" name="pr" value="${escapeHtml(ctx.pr)}" />
          <input type="hidden" name="hash" value="${escapeHtml(ctx.hash)}" />
          <input type="hidden" name="meaning" value="${escapeHtml(ctx.meaning)}" />
          <input type="hidden" name="role" value="${escapeHtml(ctx.role)}" />
          <input type="hidden" name="signer" value="${escapeHtml(ctx.signer)}" />
          <input type="hidden" name="required_signatures" value="${escapeHtml(ctx.required_signatures)}" />
          <input type="hidden" name="signature_index" value="${escapeHtml(ctx.signature_index)}" />
          <input type="hidden" name="exp" value="${escapeHtml(ctx.exp)}" />
          <input type="hidden" name="sig" value="${escapeHtml(sig)}" />
          <button class="btn" type="submit" data-processing-text="Opening GitHub...">Continue with ${escapeHtml(providerLabel)}</button>
        </form>
      </div>
      <div class="section foot">
        PR: <a href="${escapeHtml(prUrl)}" target="_blank" rel="noreferrer">${escapeHtml(prUrl)}</a>
      </div>
    </div>
  </div>
  <script>
    (function () {
      var UNLOCK_MS = 12000;
      var form = document.querySelector('form[data-submit-guard]');
      if (!form) return;
      var unlock = function (target) {
        if (!(target instanceof HTMLFormElement)) return;
        delete target.dataset.submitting;
        var submit = target.querySelector('button[type="submit"], input[type="submit"]');
        if (submit instanceof HTMLButtonElement) {
          submit.disabled = false;
          if (submit.dataset.originalText !== undefined) {
            submit.textContent = submit.dataset.originalText;
          }
        } else if (submit instanceof HTMLInputElement) {
          submit.disabled = false;
          if (submit.dataset.originalValue !== undefined) {
            submit.value = submit.dataset.originalValue;
          }
        }
      };
      form.addEventListener('submit', function (event) {
        var target = event.currentTarget;
        if (!(target instanceof HTMLFormElement)) return;
        if (target.dataset.submitting === '1') {
          event.preventDefault();
          return;
        }
        target.dataset.submitting = '1';
        var submit = target.querySelector('button[type="submit"], input[type="submit"]');
        if (submit instanceof HTMLButtonElement) {
          submit.dataset.originalText = submit.textContent || '';
          submit.textContent = submit.dataset.processingText || 'Processing...';
          submit.disabled = true;
        } else if (submit instanceof HTMLInputElement) {
          submit.dataset.originalValue = submit.value || '';
          submit.value = submit.dataset.processingText || 'Processing...';
          submit.disabled = true;
        }
        window.setTimeout(function () { unlock(target); }, UNLOCK_MS);
      });
    })();
  </script>
</body>
</html>`;
}

function renderPinSetupPage(session: PinSessionState, sessionToken: string): string {
  const formAction = `/pin/complete`;
  const prUrl = `https://github.com/${session.ctx.repo}/pull/${session.ctx.pr}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Set QMS Signature PIN</title>
  <style>
    body { margin: 0; font: 16px/1.45 "Segoe UI", "Avenir Next", sans-serif; background: #f4f8ff; color: #15223a; }
    .wrap { max-width: 760px; margin: 34px auto; padding: 0 16px; }
    .card { background: #fff; border: 1px solid #d6deef; border-radius: 14px; box-shadow: 0 12px 32px rgba(19,36,78,.09); }
    .head { padding: 16px 20px; background: #123260; color: #fff; border-radius: 14px 14px 0 0; }
    .body { padding: 16px 20px; }
    .explain { background: #eef5ff; border: 1px solid #c9daf8; border-radius: 10px; padding: 12px; color: #21375f; }
    .k { color: #4d5f84; font-size: 13px; margin-top: 8px; }
    .v { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; background: #f2f6ff; border: 1px solid #d6deef; border-radius: 8px; padding: 8px; }
    label { display: block; margin-top: 12px; font-weight: 600; }
    input[type="password"] { width: 100%; margin-top: 6px; padding: 12px; border: 1px solid #b8c6e2; border-radius: 10px; font-size: 16px; letter-spacing: .2em; }
    .hint { color: #5d6f92; font-size: 13px; margin-top: 6px; }
    .btn { margin-top: 14px; border: none; border-radius: 10px; padding: 12px 16px; font-size: 15px; font-weight: 650; background: #0f3d7a; color: #fff; cursor: pointer; }
    .btn[disabled] { opacity: .68; cursor: not-allowed; }
    a { color: #1b4ea4; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head"><h2>Set Your QMS Signature PIN</h2></div>
      <div class="body">
        <p class="explain">${escapeHtml(PIN_EXPLANATION_TEXT)}</p>
        <div class="k">Repository / PR</div><div class="v">${escapeHtml(session.ctx.repo)} #${escapeHtml(session.ctx.pr)}</div>
        <div class="k">Signer</div><div class="v">${escapeHtml(session.full_name)} (@${escapeHtml(session.signer_login)})</div>
        <div class="k">Role / Meaning</div><div class="v">${escapeHtml(session.ctx.role)} / ${escapeHtml(session.ctx.meaning)}</div>

        <form action="${escapeHtml(formAction)}" method="post" data-submit-guard="1">
          <input type="hidden" name="session_token" value="${escapeHtml(sessionToken)}" />
          <input type="hidden" name="mode" value="setup" />
          <label for="pin">New 6-digit PIN</label>
          <input id="pin" name="pin" type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required />
          <label for="pin_confirm">Confirm PIN</label>
          <input id="pin_confirm" name="pin_confirm" type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required />
          <div class="hint">PIN is salted + PBKDF2-hashed and stored for 60 days. It expires automatically and must be renewed.</div>
          <button class="btn" type="submit" data-processing-text="Submitting...">Set PIN and Sign</button>
        </form>

        <p><a href="${escapeHtml(prUrl)}" target="_blank" rel="noreferrer">Open PR</a></p>
      </div>
    </div>
  </div>
  <script>
    (function () {
      var UNLOCK_MS = 12000;
      var form = document.querySelector('form[data-submit-guard]');
      if (!form) return;
      var unlock = function (target) {
        if (!(target instanceof HTMLFormElement)) return;
        delete target.dataset.submitting;
        var submit = target.querySelector('button[type="submit"], input[type="submit"]');
        if (submit instanceof HTMLButtonElement) {
          submit.disabled = false;
          if (submit.dataset.originalText !== undefined) {
            submit.textContent = submit.dataset.originalText;
          }
        } else if (submit instanceof HTMLInputElement) {
          submit.disabled = false;
          if (submit.dataset.originalValue !== undefined) {
            submit.value = submit.dataset.originalValue;
          }
        }
      };
      form.addEventListener('submit', function (event) {
        var target = event.currentTarget;
        if (!(target instanceof HTMLFormElement)) return;
        if (target.dataset.submitting === '1') {
          event.preventDefault();
          return;
        }
        target.dataset.submitting = '1';
        var submit = target.querySelector('button[type="submit"], input[type="submit"]');
        if (submit instanceof HTMLButtonElement) {
          submit.dataset.originalText = submit.textContent || '';
          submit.textContent = submit.dataset.processingText || 'Processing...';
          submit.disabled = true;
        } else if (submit instanceof HTMLInputElement) {
          submit.dataset.originalValue = submit.value || '';
          submit.value = submit.dataset.processingText || 'Processing...';
          submit.disabled = true;
        }
        window.setTimeout(function () { unlock(target); }, UNLOCK_MS);
      });
    })();
  </script>
</body>
</html>`;
}

function renderPinVerifyPage(session: PinSessionState, sessionToken: string, expiringSoon: boolean, expiresAtEpoch: number | null): string {
  const formAction = `/pin/complete`;
  const expiryText = expiresAtEpoch ? new Date(expiresAtEpoch * 1000).toISOString() : "n/a";
  const warning = expiringSoon
    ? `<p style="background:#fff4e5;border:1px solid #ffd39b;border-radius:10px;padding:10px;color:#7a4a00;">Warning: your QMS signature PIN expires in less than 7 days (expires at ${escapeHtml(expiryText)}).</p>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Confirm QMS Signature PIN</title>
  <style>
    body { margin: 0; font: 16px/1.45 "Segoe UI", "Avenir Next", sans-serif; background: #f4f8ff; color: #15223a; }
    .wrap { max-width: 760px; margin: 34px auto; padding: 0 16px; }
    .card { background: #fff; border: 1px solid #d6deef; border-radius: 14px; box-shadow: 0 12px 32px rgba(19,36,78,.09); }
    .head { padding: 16px 20px; background: #123260; color: #fff; border-radius: 14px 14px 0 0; }
    .body { padding: 16px 20px; }
    .k { color: #4d5f84; font-size: 13px; margin-top: 8px; }
    .v { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; background: #f2f6ff; border: 1px solid #d6deef; border-radius: 8px; padding: 8px; }
    label { display: block; margin-top: 12px; font-weight: 600; }
    input[type="password"] { width: 100%; margin-top: 6px; padding: 12px; border: 1px solid #b8c6e2; border-radius: 10px; font-size: 16px; letter-spacing: .2em; }
    .hint { color: #5d6f92; font-size: 13px; margin-top: 6px; }
    .btn { margin-top: 14px; border: none; border-radius: 10px; padding: 12px 16px; font-size: 15px; font-weight: 650; background: #0f3d7a; color: #fff; cursor: pointer; }
    .btn[disabled] { opacity: .68; cursor: not-allowed; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head"><h2>Confirm Signature with PIN</h2></div>
      <div class="body">
        ${warning}
        <div class="k">Repository / PR</div><div class="v">${escapeHtml(session.ctx.repo)} #${escapeHtml(session.ctx.pr)}</div>
        <div class="k">Signer</div><div class="v">${escapeHtml(session.full_name)} (@${escapeHtml(session.signer_login)})</div>
        <div class="k">Role / Meaning</div><div class="v">${escapeHtml(session.ctx.role)} / ${escapeHtml(session.ctx.meaning)}</div>
        <div class="k">PIN Expiration (UTC)</div><div class="v">${escapeHtml(expiryText)}</div>

        <form action="${escapeHtml(formAction)}" method="post" data-submit-guard="1">
          <input type="hidden" name="session_token" value="${escapeHtml(sessionToken)}" />
          <input type="hidden" name="mode" value="verify" />
          <label for="pin">Enter your 6-digit PIN</label>
          <input id="pin" name="pin" type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required />
          <div class="hint">This PIN is your second electronic signature factor for QMS approvals.</div>
          <button class="btn" type="submit" data-processing-text="Verifying...">Verify PIN and Sign</button>
        </form>
        <form action="/pin/setup" method="post" data-submit-guard="1">
          <input type="hidden" name="session_token" value="${escapeHtml(sessionToken)}" />
          <button class="btn" type="submit" style="background:#5b677f;" data-processing-text="Opening reset...">Reset PIN</button>
        </form>
      </div>
    </div>
  </div>
  <script>
    (function () {
      var UNLOCK_MS = 12000;
      var forms = document.querySelectorAll('form[data-submit-guard]');
      if (!forms.length) return;
      var disableForm = function (form) {
        var submits = form.querySelectorAll('button[type="submit"], input[type="submit"]');
        submits.forEach(function (submit) {
          if (submit instanceof HTMLButtonElement) {
            submit.dataset.originalText = submit.textContent || '';
            submit.textContent = submit.dataset.processingText || 'Processing...';
            submit.disabled = true;
          } else if (submit instanceof HTMLInputElement) {
            submit.dataset.originalValue = submit.value || '';
            submit.value = submit.dataset.processingText || 'Processing...';
            submit.disabled = true;
          }
        });
      };
      var unlockForm = function (form) {
        if (!(form instanceof HTMLFormElement)) return;
        delete form.dataset.submitting;
        var submits = form.querySelectorAll('button[type="submit"], input[type="submit"]');
        submits.forEach(function (submit) {
          if (submit instanceof HTMLButtonElement) {
            submit.disabled = false;
            if (submit.dataset.originalText !== undefined) {
              submit.textContent = submit.dataset.originalText;
            }
          } else if (submit instanceof HTMLInputElement) {
            submit.disabled = false;
            if (submit.dataset.originalValue !== undefined) {
              submit.value = submit.dataset.originalValue;
            }
          }
        });
      };
      var unlockScheduled = false;
      forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
          var target = event.currentTarget;
          if (!(target instanceof HTMLFormElement)) return;
          if (target.dataset.submitting === '1') {
            event.preventDefault();
            return;
          }
          forms.forEach(function (f) {
            if (f instanceof HTMLFormElement) {
              f.dataset.submitting = '1';
              disableForm(f);
            }
          });
          if (!unlockScheduled) {
            unlockScheduled = true;
            window.setTimeout(function () {
              forms.forEach(function (f) { unlockForm(f); });
              unlockScheduled = false;
            }, UNLOCK_MS);
          }
        });
      });
    })();
  </script>
</body>
</html>`;
}

function renderSuccessPage(input: {
  repo: string;
  pr: string;
  hash: string;
  meaning: string;
  role: string;
  signer: string;
  signerFullName: string;
  timestamp: string;
  attestationId: string;
  alreadySigned: boolean;
  pinExpiringSoon: boolean;
}): string {
  const prUrl = `https://github.com/${input.repo}/pull/${input.pr}`;
  const pinWarning = input.pinExpiringSoon
    ? `<p style="background:#fff4e5;border:1px solid #ffd39b;border-radius:10px;padding:10px;color:#7a4a00;">Your signature PIN expires in less than 7 days. Renew it during your next signature flow.</p>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Signature Recorded</title>
  <style>
    body { margin: 0; font: 16px/1.45 "Segoe UI", "Avenir Next", sans-serif; background: #f4f8ff; color: #15223a; }
    .wrap { max-width: 760px; margin: 34px auto; padding: 0 16px; }
    .card { background: #fff; border: 1px solid #d6deef; border-radius: 14px; box-shadow: 0 12px 32px rgba(19,36,78,.09); }
    .head { padding: 16px 20px; background: #123260; color: #fff; border-radius: 14px 14px 0 0; }
    .body { padding: 16px 20px; }
    .k { color: #4d5f84; font-size: 13px; margin-top: 8px; }
    .v { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; background: #f2f6ff; border: 1px solid #d6deef; border-radius: 8px; padding: 8px; }
    a { color: #1b4ea4; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <h2>${input.alreadySigned ? "Signature Already Recorded" : "Signature Recorded"}</h2>
      </div>
      <div class="body">
        ${pinWarning}
        <div class="k">Repository / PR</div><div class="v">${escapeHtml(input.repo)} #${escapeHtml(input.pr)}</div>
        <div class="k">Signer</div><div class="v">${escapeHtml(input.signerFullName)} (@${escapeHtml(input.signer)})</div>
        <div class="k">Role / Meaning</div><div class="v">${escapeHtml(input.role)} / ${escapeHtml(input.meaning)}</div>
        <div class="k">Target Hash</div><div class="v">${escapeHtml(input.hash)}</div>
        <div class="k">Timestamp</div><div class="v">${escapeHtml(input.timestamp)}</div>
        <div class="k">Attestation ID</div><div class="v">${escapeHtml(input.attestationId || "n/a")}</div>
        <p><a href="${escapeHtml(prUrl)}" rel="noreferrer">Open PR</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function renderErrorPage(title: string, details: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; background: #fff7f7; color: #4a0f0f; font: 16px/1.45 "Segoe UI", sans-serif; }
    .wrap { max-width: 760px; margin: 34px auto; padding: 0 16px; }
    .card { border: 1px solid #f0b3b3; border-radius: 12px; background: #fff; }
    h1 { margin: 0; padding: 16px 20px; background: #ffe1e1; border-radius: 12px 12px 0 0; font-size: 22px; }
    p { margin: 0; padding: 16px 20px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(details)}</p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

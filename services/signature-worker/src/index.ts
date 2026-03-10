interface Env {
  PUBLIC_BASE_URL: string;
  WORKER_VERSION?: string;
  DEFAULT_OAUTH_PROVIDER?: string;
  ALLOWED_OAUTH_PROVIDERS?: string;
  GITHUB_OAUTH_CLIENT_ID: string;
  GITHUB_OAUTH_CLIENT_SECRET: string;
  QMS_BOT_APP_ID?: string;
  QMS_BOT_APP_PRIVATE_KEY?: string;
  QMS_BOT_APP_INSTALLATION_ID?: string;
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

interface SignatureRequestSigner {
  signer: string;
  role: string;
  signature_index: string;
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

interface RepostSessionState {
  type: "repost_session";
  full_name: string;
  ctx: SignatureContext;
  signer_login: string;
  attestation_id: string;
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
  requiredSignatures: string;
  signerRequests: SignatureRequestSigner[];
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

interface ErrorPresentation {
  status: number;
  title: string;
  summary: string;
  nextSteps: string[];
  technicalDetails?: string;
}

interface ExistingAttestation {
  attestation_id: string;
  comment_body: string;
  comment_url: string;
}

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const HTML_HEADERS = { "content-type": "text/html; charset=utf-8" };
const PIN_TTL_SECONDS = 5184000; // 60 days
const PIN_WARNING_SECONDS = 7 * 24 * 60 * 60; // 7 days
// Cloudflare Workers Web Crypto rejects PBKDF2 iteration counts above 100000.
const PIN_KDF_ITERATIONS = 100000;
const PIN_SALT_BYTES = 16;
const DEFAULT_AUTOMATION_BOT_LOGINS = [
  "qms-lite-bot",
  "qms-lite-bot[bot]",
  "qms-lite-sign",
  "qms-lite-sign[bot]",
  "github-actions[bot]",
];
const PIN_EXPLANATION_TEXT =
  "This 6-digit PIN acts as your secure electronic signature component for the Quality Management System, ensuring your approvals meet strict regulatory and FDA compliance standards without forcing you to re-authenticate with GitHub for every single signature.";
const PROJECT_REPO_URL = "https://github.com/AliakseiT/qms-lite";
const githubInstallationTokenCache = new Map<string, { token: string; expiresAtEpoch: number }>();

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const workerVersion = resolveWorkerVersion(env);
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path === "/healthz") {
        return json({ ok: true, service: "signature-worker", version: workerVersion });
      }
      if (path === "/") {
        return html(renderLandingPage(env.PUBLIC_BASE_URL || url.origin, workerVersion), 200);
      }
      if (path === "/sign" && request.method === "GET") {
        if (!hasLegacySignedContextParams(url.searchParams) && !hasRequestLocatorParams(url.searchParams)) {
          return html(renderLandingPage(env.PUBLIC_BASE_URL || url.origin, workerVersion), 200);
        }
        return await handleSignPage(request, env);
      }
      if (path === "/auth/start" && request.method === "POST") {
        return await handleAuthStart(request, env);
      }
      if (path === "/auth/callback" && request.method === "GET") {
        return await handleAuthCallback(request, env);
      }
      if (path === "/pin/complete" && request.method === "POST") {
        return await handlePinComplete(request, env);
      }
      if (path === "/pin/setup" && request.method === "POST") {
        return await handlePinSetup(request, env);
      }
      if (path === "/attestation/repost" && request.method === "POST") {
        return await handleAttestationRepost(request, env);
      }
      if (path === "/api/pin/status" && request.method === "POST") {
        return await handlePinStatusApi(request, env);
      }

      return renderErrorResponse("Unknown route.", workerVersion);
    } catch (error) {
      return renderErrorResponse(error, workerVersion);
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

  let context: SignatureContext;
  if (hasLegacySignedContextParams(url.searchParams)) {
    throw new Error("Legacy signing link expired. A new signature request is required.");
  }
  const locator = parseRequestLocatorFromParams(url.searchParams);
  context = await resolveCurrentContextForSigner(locator.repo, locator.pr, locator.signer, env);

  return html(
    renderSignPage(context, provider, env.PUBLIC_BASE_URL, resolveWorkerVersion(env)),
    200
  );
}

async function handleAuthStart(request: Request, env: Env): Promise<Response> {
  assertBaseConfig(env);
  const form = await request.formData();

  const provider = resolveProvider(
    String(form.get("provider") || env.DEFAULT_OAUTH_PROVIDER || "github").toLowerCase(),
    env
  );

  let context: SignatureContext;
  if (hasLegacySignedContextFormData(form)) {
    throw new Error("Legacy signing link expired. A new signature request is required.");
  }
  const locator = requestLocatorFromFormData(form);
  context = await resolveCurrentContextForSigner(locator.repo, locator.pr, locator.signer, env);

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

  const repoToken = await resolveRepoAccessToken(state.ctx.repo, env);
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
    const repostToken = await signToken(buildRepostSessionState(state.ctx, signerLogin, registryFullName, duplicate.attestation_id), env.SIGNATURE_STATE_SECRET);
    if (apiMode || wantsJson(request)) {
      return json({
        ok: true,
        already_signed: true,
        attestation_id: duplicate.attestation_id,
        repost_available: true,
        repost_session_token: repostToken,
      });
    }
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
      statusMessage: "This signature is already on record. If you need to retrigger downstream automation, you can re-post the existing attestation without creating a new signature.",
      pinExpiringSoon: false,
      repostToken,
      workerVersion: resolveWorkerVersion(env),
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
    return html(renderPinSetupPage(sessionState, sessionToken, resolveWorkerVersion(env)), 200);
  }
  return html(
    renderPinVerifyPage(
      sessionState,
      sessionToken,
      pinStatus.expiringSoon,
      pinStatus.expiresAtEpoch,
      resolveWorkerVersion(env)
    ),
    200
  );
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

  const repoToken = await resolveRepoAccessToken(session.ctx.repo, env);
  const duplicate = await findExistingAttestation(session.ctx, session.signer_login, repoToken, env);
  let attestationId = duplicate?.attestation_id || "";
  let timestamp = new Date().toISOString();
  let alreadySigned = Boolean(duplicate);
  const repostToken = duplicate
    ? await signToken(buildRepostSessionState(session.ctx, session.signer_login, session.full_name, duplicate.attestation_id), env.SIGNATURE_STATE_SECRET)
    : "";

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
      repoToken,
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
      repost_available: alreadySigned,
      repost_session_token: repostToken || undefined,
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
    statusMessage: alreadySigned
      ? "This signature is already on record. If you need to retrigger downstream automation, you can re-post the existing attestation without creating a new signature."
      : "",
    pinExpiringSoon: pinStatusAfter.expiringSoon,
    repostToken: repostToken || undefined,
    workerVersion: resolveWorkerVersion(env),
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
  return html(renderPinSetupPage(session, sessionToken, resolveWorkerVersion(env)), 200);
}

async function handleAttestationRepost(request: Request, env: Env): Promise<Response> {
  assertBaseConfig(env);
  const form = await request.formData();
  const repostToken = String(form.get("repost_token") || "").trim();
  if (!repostToken) {
    throw new Error("Missing attestation repost session token.");
  }

  const session = (await verifyToken(repostToken, env.SIGNATURE_STATE_SECRET)) as RepostSessionState;
  if (session.type !== "repost_session") {
    throw new Error("Invalid attestation repost session token.");
  }
  if (session.exp_state < nowEpoch()) {
    throw new Error("Attestation repost session expired. Restart from the PR link.");
  }

  const repoToken = await resolveRepoAccessToken(session.ctx.repo, env);
  const requestMeta = await resolveLatestRequestComment(session.ctx.repo, Number.parseInt(session.ctx.pr, 10), repoToken, env);
  validateRequestAgainstContext(requestMeta, session.ctx);

  const existing = await findExistingAttestation(session.ctx, session.signer_login, repoToken, env);
  if (!existing) {
    throw new Error("Existing attestation not found. Restart signing from the PR link.");
  }
  if (existing.attestation_id !== session.attestation_id) {
    throw new Error("Attestation repost target changed. Restart signing from the PR link.");
  }

  await githubPost(
    `/repos/${session.ctx.repo}/issues/${session.ctx.pr}/comments`,
    repoToken,
    { body: existing.comment_body },
    env
  );

  const freshRepostToken = await signToken(
    buildRepostSessionState(session.ctx, session.signer_login, session.full_name, existing.attestation_id),
    env.SIGNATURE_STATE_SECRET
  );

  return html(renderSuccessPage({
    repo: session.ctx.repo,
    pr: session.ctx.pr,
    hash: session.ctx.hash,
    meaning: session.ctx.meaning,
    role: session.ctx.role,
    signer: session.signer_login,
    signerFullName: session.full_name,
    timestamp: new Date().toISOString(),
    attestationId: existing.attestation_id,
    alreadySigned: true,
    statusMessage: "The existing attestation was re-posted to retrigger downstream automation. No new signature was created.",
    pinExpiringSoon: false,
    repostToken: freshRepostToken,
    workerVersion: resolveWorkerVersion(env),
  }), 200);
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
    "SIGNATURE_STATE_SECRET",
    "PIN_PEPPER",
  ] as const;
  for (const key of required) {
    const value = String(env[key] || "").trim();
    if (!value) {
      throw new Error(`Missing required configuration: ${key}`);
    }
  }
  const hasAppConfig = Boolean(resolveBotAppId(env) && resolveBotAppPrivateKey(env));
  if (!hasAppConfig) {
    throw new Error("Missing required repository access configuration: QMS_BOT_APP_ID and QMS_BOT_APP_PRIVATE_KEY.");
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

function buildRepostSessionState(
  ctx: SignatureContext,
  signerLogin: string,
  fullName: string,
  attestationId: string
): RepostSessionState {
  return {
    type: "repost_session",
    full_name: fullName,
    ctx,
    signer_login: signerLogin,
    attestation_id: attestationId,
    iat: nowEpoch(),
    exp_state: nowEpoch() + 10 * 60,
    nonce: randomHex(12),
  };
}

async function signToken(payload: OAuthState | PinSessionState | RepostSessionState, secret: string): Promise<string> {
  const encoded = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await hmacHexAsync(encoded, secret);
  return `${encoded}.${signature}`;
}

async function verifyToken(token: string, secret: string): Promise<OAuthState | PinSessionState | RepostSessionState> {
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
  let parsed: OAuthState | PinSessionState | RepostSessionState;
  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes)) as OAuthState | PinSessionState | RepostSessionState;
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
  const comments = await githubGet<Array<{ id: number; html_url: string; body?: string; created_at?: string; user?: { login?: string } }>>(
    `/repos/${repo}/issues/${prNumber}/comments?per_page=100`,
    token,
    env
  );
  const botLogins = resolveAutomationBotLogins();
  const requestMarkers = [
    "<!-- signature-request -->",
    "<!-- signature-native-signature-request -->",
    "<!-- part11-signature-request -->",
    "<!-- part11-native-signature-request -->",
  ];

  const requestComments = comments
    .filter((c) => {
      const body = c.body || "";
      const login = String(c.user?.login || "").trim().toLowerCase();
      return requestMarkers.some((marker) => body.includes(marker)) && botLogins.has(login);
    })
    .sort((a, b) => Date.parse(a.created_at || "") - Date.parse(b.created_at || ""));
  if (requestComments.length === 0) {
    throw new Error(`No signature request comment found on PR #${prNumber}.`);
  }

  const latest = requestComments[requestComments.length - 1];
  const body = latest.body || "";
  const hiddenMeta = parseHiddenRequestContext(body);

  const hash = hiddenMeta?.hash || extractOne(body, /Target hash \(merge state\):\s*`([a-f0-9]{64})`/i, "target hash");
  const meaning =
    hiddenMeta?.meaning ||
    extractOne(body, /Meaning of signature:\s*\*\*([^*]+)\*\*/i, "meaning of signature");
  const rolesRaw = hiddenMeta?.signers.map((x) => x.role).filter(Boolean).join(", ") ||
    extractOne(body, /Designated signatory role\(s\):\s*\*\*([^*]+)\*\*/i, "signer roles");
  const eligibleRaw = hiddenMeta?.signers.map((x) => `@${x.signer}`).join(", ") ||
    extractOne(body, /Eligible signers:\s*\*\*([^*]+)\*\*/i, "eligible signers");
  const requiredSignatures = hiddenMeta?.required_signatures || parseRequiredSignatures(body);

  const roles = rolesRaw
    .split(/[;,]/)
    .map((x) => x.trim())
    .filter(Boolean);
  const eligibleSigners = Array.from(eligibleRaw.matchAll(/@([A-Za-z0-9-]+)/g)).map((m) => m[1].toLowerCase());
  const signerRequests = hiddenMeta && hiddenMeta.signers.length > 0
    ? hiddenMeta.signers
    : parseSignerRequests(body, roles);

  return {
    commentId: Number(latest.id),
    commentUrl: String(latest.html_url || ""),
    hash,
    meaning,
    roles,
    eligibleSigners,
    requiredSignatures,
    signerRequests,
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
  const signerRequest = meta.signerRequests.find((x) => x.signer === signerLower);
  if (meta.signerRequests.length > 0 && !signerRequest) {
    throw new Error(`Signer @${ctx.signer} is not assigned a signature slot in the current request.`);
  }
  if (signerRequest && signerRequest.role && signerRequest.role.toLowerCase() !== roleLower) {
    throw new Error(`Role '${ctx.role}' does not match the current request slot for @${ctx.signer}.`);
  }
  if (meta.eligibleSigners.length > 0 && !meta.eligibleSigners.includes(signerLower)) {
    throw new Error(`Signer @${ctx.signer} is not eligible for this request.`);
  }
}

function parseRequiredSignatures(body: string): string {
  const match = String(body || "").match(/Required signatures:\s*\*\*([0-9]+)\*\*/i);
  const value = match ? String(match[1] || "").trim() : "1";
  return /^\d+$/.test(value) ? value : "1";
}

function parseSignerRequests(body: string, fallbackRoles: string[]): SignatureRequestSigner[] {
  return Array.from(String(body || "").matchAll(/^- @([A-Za-z0-9-]+)(?: \(([^)]+)\))?: /gm))
    .map((match, index) => ({
      signer: String(match[1] || "").trim().toLowerCase(),
      role: String(match[2] || fallbackRoles[index] || fallbackRoles[0] || "").trim(),
      signature_index: String(index + 1),
    }))
    .filter((entry) => entry.signer);
}

function parseHiddenRequestContext(body: string): {
  hash: string;
  meaning: string;
  required_signatures: string;
  signers: SignatureRequestSigner[];
} | null {
  const match = String(body || "").match(/<!--\s*SIGNATURE_REQUEST_CONTEXT_V1\s*([\s\S]*?)-->/i);
  if (!match || !match[1]) {
    return null;
  }

  try {
    const payload = JSON.parse(match[1].trim()) as {
      hash?: string;
      meaning?: string;
      required_signatures?: string | number;
      signers?: Array<{ signer?: string; role?: string; signature_index?: string | number }>;
    };
    const hash = String(payload.hash || "").trim().toLowerCase();
    const meaning = String(payload.meaning || "").trim();
    const requiredSignatures = String(payload.required_signatures || "1").trim();
    const signers = Array.isArray(payload.signers)
      ? payload.signers
          .map((entry, index) => ({
            signer: String(entry?.signer || "").trim().toLowerCase(),
            role: String(entry?.role || "").trim(),
            signature_index: String(entry?.signature_index || index + 1).trim(),
          }))
          .filter((entry) => entry.signer)
      : [];
    if (!/^[a-f0-9]{64}$/.test(hash) || !meaning || !/^\d+$/.test(requiredSignatures)) {
      return null;
    }
    return {
      hash,
      meaning,
      required_signatures: requiredSignatures,
      signers,
    };
  } catch {
    return null;
  }
}

async function resolveCurrentContextForSigner(repo: string, pr: string, signer: string, env: Env): Promise<SignatureContext> {
  const normalizedRepo = repo.trim();
  const normalizedPr = pr.trim();
  const normalizedSigner = signer.trim().toLowerCase();
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(normalizedRepo)) throw new Error("Invalid repository.");
  if (!/^\d+$/.test(normalizedPr)) throw new Error("Invalid PR number.");
  if (!/^[A-Za-z0-9-]+$/.test(normalizedSigner)) throw new Error("Invalid signer login.");

  const repoToken = await resolveRepoAccessToken(normalizedRepo, env);
  const requestMeta = await resolveLatestRequestComment(normalizedRepo, Number.parseInt(normalizedPr, 10), repoToken, env);
  const signerRequest = requestMeta.signerRequests.find((entry) => entry.signer === normalizedSigner);
  const role = String(signerRequest?.role || (requestMeta.roles.length === 1 ? requestMeta.roles[0] : "")).trim();
  if (!role) {
    throw new Error(`Unable to resolve signer role for @${normalizedSigner} from the latest request comment.`);
  }

  const context: SignatureContext = {
    repo: normalizedRepo,
    pr: normalizedPr,
    hash: requestMeta.hash,
    meaning: requestMeta.meaning,
    role,
    signer: normalizedSigner,
    required_signatures: requestMeta.requiredSignatures,
    signature_index: String(signerRequest?.signature_index || "1"),
    exp: "",
  };
  validateRequestAgainstContext(requestMeta, context);
  return context;
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

async function findExistingAttestation(ctx: SignatureContext, signer: string, token: string, env: Env): Promise<ExistingAttestation | null> {
  const comments = await githubGet<Array<{ body?: string; html_url?: string }>>(
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
        return {
          attestation_id: String(parsed.attestation_id || ""),
          comment_body: body,
          comment_url: String(c.html_url || ""),
        };
      }
    } catch {
      continue;
    }
  }

  return null;
}

function resolveAutomationBotLogins(): Set<string> {
  return new Set(DEFAULT_AUTOMATION_BOT_LOGINS.map((login) => login.toLowerCase()));
}

function resolveBotAppId(env: Env): string {
  return String(env.QMS_BOT_APP_ID || "").trim();
}

function resolveBotAppPrivateKey(env: Env): string {
  return String(env.QMS_BOT_APP_PRIVATE_KEY || "").trim();
}

function resolveBotInstallationId(env: Env): string {
  return String(env.QMS_BOT_APP_INSTALLATION_ID || "").trim();
}

async function resolveRepoAccessToken(repo: string, env: Env): Promise<string> {
  const appId = resolveBotAppId(env);
  const privateKey = resolveBotAppPrivateKey(env);
  if (!appId || !privateKey) {
    throw new Error("QMS_BOT_APP_ID and QMS_BOT_APP_PRIVATE_KEY must both be configured.");
  }
  return mintGithubInstallationToken(repo, appId, privateKey, resolveBotInstallationId(env), env);
}

async function mintGithubInstallationToken(
  repo: string,
  appId: string,
  privateKeyPem: string,
  installationIdHint: string,
  env: Env
): Promise<string> {
  const installationId = installationIdHint || String(await resolveInstallationId(repo, appId, privateKeyPem, env));
  const cacheKey = `${repo}:${installationId}`;
  const cached = githubInstallationTokenCache.get(cacheKey);
  if (cached && cached.expiresAtEpoch > nowEpoch() + 60) {
    return cached.token;
  }

  const appJwt = await createGithubAppJwt(appId, privateKeyPem);
  const payload = await githubPost<{ token?: string; expires_at?: string }>(
    `/app/installations/${installationId}/access_tokens`,
    appJwt,
    {},
    env
  );
  const token = String(payload.token || "").trim();
  if (!token) {
    throw new Error(`GitHub App installation token minting returned no token for installation ${installationId}.`);
  }
  const expiresAtEpoch = Math.floor(Date.parse(String(payload.expires_at || "")) / 1000) || (nowEpoch() + 50 * 60);
  githubInstallationTokenCache.set(cacheKey, { token, expiresAtEpoch });
  return token;
}

async function resolveInstallationId(repo: string, appId: string, privateKeyPem: string, env: Env): Promise<number> {
  const appJwt = await createGithubAppJwt(appId, privateKeyPem);
  const installation = await githubGet<{ id?: number }>(
    `/repos/${repo}/installation`,
    appJwt,
    env
  );
  const installationId = Number(installation.id || 0);
  if (!Number.isInteger(installationId) || installationId < 1) {
    throw new Error(`Unable to resolve GitHub App installation for ${repo}.`);
  }
  return installationId;
}

async function createGithubAppJwt(appId: string, privateKeyPem: string): Promise<string> {
  const header = base64UrlEncode(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = base64UrlEncode(
    new TextEncoder().encode(
      JSON.stringify({
        iat: nowEpoch() - 60,
        exp: nowEpoch() + 9 * 60,
        iss: appId,
      })
    )
  );
  const signingInput = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToPkcs8Buffer(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    toArrayBuffer(new TextEncoder().encode(signingInput))
  );
  return `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;
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
      salt: toArrayBuffer(hexToBytes(saltHex)),
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
    authorization: `Bearer ${token}`,
    accept: "application/vnd.github+json",
    "user-agent": "qms-lite-bot-signature-service",
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
  return new TextDecoder().decode(decodeBase64Loose(value, "base64 content"));
}

function pemToPkcs8Buffer(pem: string): ArrayBuffer {
  let normalized = String(pem || "").trim();
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1).trim();
  }
  normalized = normalized.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\r");
  normalized = normalized.replace(/^QMS_BOT_APP_PRIVATE_KEY\s*=\s*/i, "").trim();

  if (!normalized) {
    throw new Error("GitHub App private key is empty or invalid.");
  }

  if (normalized.includes("-----BEGIN")) {
    return pemOrDerTextToPkcs8Buffer(normalized);
  }

  const decoded = decodeBase64Loose(normalized, "GitHub App private key");
  const decodedText = tryDecodeUtf8(decoded).trim();
  if (decodedText.includes("-----BEGIN")) {
    return pemOrDerTextToPkcs8Buffer(decodedText);
  }

  return classifyDerPrivateKey(decoded, "GitHub App private key");
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function pemOrDerTextToPkcs8Buffer(text: string): ArrayBuffer {
  const isPkcs1RsaPem = text.includes("-----BEGIN RSA PRIVATE KEY-----");
  const base64 = text
    .replace(/-----BEGIN RSA PRIVATE KEY-----/g, "")
    .replace(/-----END RSA PRIVATE KEY-----/g, "")
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  if (!base64) {
    throw new Error("GitHub App private key is empty or invalid.");
  }
  const der = decodeBase64Loose(base64, "GitHub App private key PEM body");
  return isPkcs1RsaPem ? wrapPkcs1RsaPrivateKeyAsPkcs8(der) : classifyDerPrivateKey(der, "GitHub App private key");
}

function classifyDerPrivateKey(der: Uint8Array, label: string): ArrayBuffer {
  const derKind = detectPrivateKeyDerKind(der);
  if (derKind === "pkcs1") {
    return wrapPkcs1RsaPrivateKeyAsPkcs8(der);
  }
  if (derKind === "pkcs8") {
    return toArrayBuffer(der);
  }
  throw new Error(`${label} is not a supported PKCS#1 or PKCS#8 private key format.`);
}

function detectPrivateKeyDerKind(der: Uint8Array): "pkcs1" | "pkcs8" | "unknown" {
  let offset = 0;
  if (der[offset++] !== 0x30) {
    return "unknown";
  }
  offset = skipDerLength(der, offset);
  if (offset < 0 || der[offset++] !== 0x02) {
    return "unknown";
  }
  offset = skipDerLength(der, offset);
  if (offset < 0) {
    return "unknown";
  }
  if (offset >= der.length) {
    return "unknown";
  }
  if (der[offset] === 0x30) {
    return "pkcs8";
  }
  if (der[offset] === 0x02) {
    return "pkcs1";
  }
  return "unknown";
}

function skipDerLength(der: Uint8Array, offset: number): number {
  if (offset >= der.length) return -1;
  const first = der[offset++];
  if ((first & 0x80) === 0) {
    return offset + first;
  }
  const count = first & 0x7f;
  if (count < 1 || count > 4 || offset + count > der.length) {
    return -1;
  }
  let length = 0;
  for (let i = 0; i < count; i += 1) {
    length = (length << 8) | der[offset + i];
  }
  return offset + count + length;
}

function decodeBase64Loose(value: string, label: string): Uint8Array {
  const normalized = String(value || "").replace(/\s+/g, "");
  try {
    return base64ToBytes(normalized);
  } catch {
    throw new Error(`${label} is not valid base64 data.`);
  }
}

function tryDecodeUtf8(bytes: Uint8Array): string {
  try {
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

function wrapPkcs1RsaPrivateKeyAsPkcs8(pkcs1Der: Uint8Array): ArrayBuffer {
  const version = new Uint8Array([0x02, 0x01, 0x00]);
  const rsaAlgorithmIdentifier = new Uint8Array([
    0x30, 0x0d,
    0x06, 0x09,
    0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01,
    0x05, 0x00,
  ]);
  const privateKeyOctetString = derEncode(0x04, pkcs1Der);
  return toArrayBuffer(derEncode(0x30, concatBytes(version, rsaAlgorithmIdentifier, privateKeyOctetString)));
}

function derEncode(tag: number, value: Uint8Array): Uint8Array {
  return concatBytes(new Uint8Array([tag]), derEncodeLength(value.length), value);
}

function derEncodeLength(length: number): Uint8Array {
  if (length < 0x80) {
    return new Uint8Array([length]);
  }
  const bytes: number[] = [];
  let remaining = length;
  while (remaining > 0) {
    bytes.unshift(remaining & 0xff);
    remaining >>= 8;
  }
  return new Uint8Array([0x80 | bytes.length, ...bytes]);
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
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

function resolveWorkerVersion(env: Env): string {
  const raw = String(env.WORKER_VERSION || "").trim();
  return raw || "dev-unversioned";
}

function parseRequestLocatorFromParams(params: URLSearchParams): { repo: string; pr: string; signer: string } {
  return {
    repo: String(params.get("repo") || "").trim(),
    pr: String(params.get("pr") || "").trim(),
    signer: String(params.get("signer") || "").trim().toLowerCase(),
  };
}

function requestLocatorFromFormData(form: FormData): { repo: string; pr: string; signer: string } {
  return {
    repo: String(form.get("repo") || "").trim(),
    pr: String(form.get("pr") || "").trim(),
    signer: String(form.get("signer") || "").trim().toLowerCase(),
  };
}

function hasLegacySignedContextParams(params: URLSearchParams): boolean {
  const required = ["repo", "pr", "hash", "meaning", "role", "signer", "exp", "sig"];
  return required.every((key) => String(params.get(key) || "").trim() !== "");
}

function hasRequestLocatorParams(params: URLSearchParams): boolean {
  const required = ["repo", "pr", "signer"];
  return required.every((key) => String(params.get(key) || "").trim() !== "");
}

function hasLegacySignedContextFormData(form: FormData): boolean {
  const required = ["repo", "pr", "hash", "meaning", "role", "signer", "exp", "sig"];
  return required.every((key) => String(form.get(key) || "").trim() !== "");
}

function html(content: string, status = 200): Response {
  return new Response(content, { status, headers: HTML_HEADERS });
}

function json(content: unknown, status = 200): Response {
  return new Response(JSON.stringify(content), { status, headers: JSON_HEADERS });
}

function renderErrorResponse(error: unknown, workerVersion: string): Response {
  const presentation = classifyError(error);
  try {
    return html(renderErrorPage(presentation, workerVersion), presentation.status);
  } catch {
    const summary = `${presentation.title}\n\n${presentation.summary}`;
    return new Response(summary, {
      status: presentation.status,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}

function classifyError(error: unknown): ErrorPresentation {
  const details = String(error instanceof Error ? error.message : error || "Unexpected worker error.").trim();
  const normalized = details.toLowerCase();
  const defaultNextSteps = [
    "Return to the GitHub pull request or issue comment and open the latest signature link.",
    "If the problem keeps happening, contact the QMS administrator and include the technical details below.",
  ];

  if (normalized === "unknown route.") {
    return {
      status: 404,
      title: "Page not found",
      summary: "This address is not a valid QMS signature route.",
      nextSteps: [
        "Open the signature ceremony link directly from the GitHub request comment.",
        "If you typed the URL manually, discard it and use the latest link from GitHub.",
      ],
      technicalDetails: details,
    };
  }

  if (
    normalized.includes("signing link expired") ||
    normalized.includes("legacy signing link expired") ||
    normalized.includes("sign session expired") ||
    normalized.includes("pin session expired") ||
    normalized.includes("invalid signature token") ||
    normalized.includes("invalid signed link payload") ||
    normalized.includes("invalid token")
  ) {
    return {
      status: 400,
      title: "This signing session is no longer valid",
      summary: "The link or in-progress signing session has expired or is no longer accepted.",
      nextSteps: defaultNextSteps,
      technicalDetails: details,
    };
  }

  if (normalized.includes("stale (hash mismatch)") || normalized.includes("latest request comment")) {
    return {
      status: 409,
      title: "This signature request is out of date",
      summary: "The request changed after this signing flow started, so the worker refused to continue with stale context.",
      nextSteps: [
        "Open the latest signature link from the GitHub request comment.",
        "If the request was just updated, refresh GitHub and retry from the newest comment state.",
      ],
      technicalDetails: details,
    };
  }

  if (
    normalized.includes("you are signed in as") ||
    normalized.includes("is not eligible for this request") ||
    normalized.includes("is not assigned a signature slot") ||
    normalized.includes("does not match the current request slot") ||
    normalized.includes("role '") ||
    normalized.includes("unable to resolve signer role")
  ) {
    return {
      status: 403,
      title: "You are not authorized for this signature request",
      summary: "The current GitHub account or signer assignment does not match the request that is being signed.",
      nextSteps: [
        "Confirm you are signed into the correct GitHub account for this request.",
        "Open your own signer link from the GitHub request comment instead of reusing someone else's link.",
      ],
      technicalDetails: details,
    };
  }

  if (normalized.includes("invalid pin")) {
    return {
      status: 403,
      title: "PIN verification failed",
      summary: "The QMS signature PIN was not accepted.",
      nextSteps: [
        "Try again with your current 6-digit QMS PIN.",
        "If you recently rotated or forgot the PIN, use the reset path and then restart from the latest signature link.",
      ],
      technicalDetails: details,
    };
  }

  if (normalized.includes("pin must be exactly 6 digits") || normalized.includes("pin confirmation must be exactly 6 digits")) {
    return {
      status: 400,
      title: "PIN format is invalid",
      summary: "The QMS signature PIN must contain exactly six digits.",
      nextSteps: [
        "Enter a 6-digit numeric PIN.",
        "If you are setting a new PIN, make sure both entries match.",
      ],
      technicalDetails: details,
    };
  }

  if (normalized.includes("pin and confirmation do not match")) {
    return {
      status: 400,
      title: "PIN confirmation does not match",
      summary: "The two PIN values were different, so the worker did not save or use them.",
      nextSteps: [
        "Enter the same 6-digit PIN in both fields.",
        "Restart the flow from the latest GitHub link if this page has been open for a while.",
      ],
      technicalDetails: details,
    };
  }

  if (
    normalized.includes("missing required configuration") ||
    normalized.includes("missing required repository access configuration") ||
    normalized.includes("missing required kv binding")
  ) {
    return {
      status: 500,
      title: "Signature service is not configured correctly",
      summary: "The signing worker is missing required configuration and cannot complete the ceremony right now.",
      nextSteps: [
        "Contact the QMS administrator to repair the signature worker configuration.",
        "Retry after the worker configuration has been updated.",
      ],
      technicalDetails: details,
    };
  }

  if (
    normalized.includes("github api get") ||
    normalized.includes("github api post") ||
    normalized.includes("github oauth exchange failed") ||
    normalized.includes("gitHub app".toLowerCase())
  ) {
    return {
      status: 502,
      title: "The signature service could not complete a GitHub check",
      summary: "The worker could not finish a required GitHub API or OAuth step.",
      nextSteps: [
        "Wait a moment and retry from the latest GitHub signature link.",
        "If the problem persists, contact the QMS administrator and include the technical details below.",
      ],
      technicalDetails: details,
    };
  }

  return {
    status: 500,
    title: "Unable to complete the signature request",
    summary: "The worker hit an unexpected condition before it could finish the signing ceremony.",
    nextSteps: defaultNextSteps,
    technicalDetails: details,
  };
}

function renderLandingPage(baseUrl: string, workerVersion: string): string {
  const title = "DearAuditor Open QMS Baseline Signature";
  const safeBaseUrl = stripTrailingSlash(baseUrl);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --bg: #f3f6f8;
      --card: #ffffff;
      --ink: #13263a;
      --muted: #536273;
      --line: #d7e0e7;
      --accent: #143246;
      --accent-soft: #edf3f6;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: radial-gradient(circle at top, #ffffff 0%, #f3f6f8 58%, #e8eef2 100%);
      color: var(--ink);
      font: 16px/1.45 "Segoe UI", "Avenir Next", "Helvetica Neue", sans-serif;
      padding: 24px;
    }
    .card {
      width: min(720px, 100%);
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 18px;
      box-shadow: 0 18px 44px rgba(14, 34, 54, 0.08);
      padding: 28px 28px 24px;
      text-align: center;
    }
    .mark {
      width: 128px;
      height: 128px;
      margin: 0 auto 18px;
      display: block;
    }
    h1 {
      margin: 0;
      font-size: 32px;
      line-height: 1.1;
      letter-spacing: -0.03em;
    }
    p {
      margin: 14px auto 0;
      max-width: 540px;
      color: var(--muted);
      font-size: 18px;
    }
    .links {
      margin-top: 22px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }
    .link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 180px;
      padding: 12px 16px;
      border-radius: 999px;
      border: 1px solid var(--line);
      text-decoration: none;
      color: var(--accent);
      background: var(--accent-soft);
      font-weight: 700;
    }
    .meta {
      margin-top: 18px;
      color: var(--muted);
      font-size: 13px;
    }
    .version {
      margin-top: 8px;
      color: var(--muted);
      font-size: 13px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }
  </style>
</head>
<body>
  <main class="card">
    ${renderSignatureBadgeSvg()}
    <h1>DearAuditor Open QMS Baseline Signature</h1>
    <p>Signature service for DearAuditor Open QMS Baseline, a GitHub-based QMS aligned with ISO 13485, ISO 14971, IEC 62304, and IEC 62366-1.</p>
    <div class="links">
      <a class="link" href="${escapeHtml(PROJECT_REPO_URL)}" target="_blank" rel="noreferrer">Open Baseline Repository</a>
    </div>
    <div class="meta">Service URL: ${escapeHtml(safeBaseUrl)}</div>
    <div class="version">Worker version: ${escapeHtml(workerVersion)}</div>
  </main>
</body>
</html>`;
}

function renderSignatureBadgeSvg(): string {
  return `<svg class="mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="DearAuditor Open QMS Baseline Signature logo">
  <rect width="512" height="512" rx="116" fill="#edf3f6"/>
  <circle cx="256" cy="256" r="182" fill="#143046"/>
  <circle cx="256" cy="256" r="164" fill="#f5fbff"/>
  <rect x="132" y="138" width="248" height="22" rx="11" fill="#69b8db"/>
  <g fill="#143246" font-family="'Avenir Next', 'Segoe UI', sans-serif" text-anchor="middle">
    <text x="256" y="228" font-size="40" font-weight="800" letter-spacing="2">DEARAUDITOR</text>
    <text x="256" y="316" font-size="92" font-weight="900" letter-spacing="7">SIGN</text>
  </g>
  <path d="M318 350l34-34 22 22-34 34h-22z" fill="#143246"/>
  <path d="M316 352l8 24 24-8z" fill="#7dd4de"/>
</svg>`;
}

function renderSignPage(
  ctx: SignatureContext,
  provider: string,
  baseUrl: string,
  workerVersion: string
): string {
  const title = "DearAuditor Open QMS Baseline Sign";
  const providerLabel = provider === "github" ? "GitHub" : provider;
  const formAction = `${stripTrailingSlash(baseUrl)}/auth/start`;
  const requestUrl = `https://github.com/${ctx.repo}/issues/${ctx.pr}`;
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
    .version { margin-top: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    a { color: #1b4ea4; }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <h1>QMS Signature Ceremony</h1>
        <p>Identity is your active ${escapeHtml(providerLabel)} login, signature context is locked from the current request, PIN is verified next.</p>
      </div>
      <div class="section">
        <div class="grid">
          <div><div class="k">Repository</div><div class="v">${escapeHtml(ctx.repo)}</div></div>
          <div><div class="k">Request Number</div><div class="v">${escapeHtml(ctx.pr)}</div></div>
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
          <input type="hidden" name="signer" value="${escapeHtml(ctx.signer)}" />
          <button class="btn" type="submit" data-processing-text="Opening GitHub...">Continue with ${escapeHtml(providerLabel)}</button>
        </form>
      </div>
      <div class="section foot">
        Request: <a href="${escapeHtml(requestUrl)}" target="_blank" rel="noreferrer">${escapeHtml(requestUrl)}</a>
        <div class="version">Worker version: ${escapeHtml(workerVersion)}</div>
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

function renderPinSetupPage(session: PinSessionState, sessionToken: string, workerVersion: string): string {
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
    .version { margin-top: 14px; color: #5d6f92; font-size: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
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
        <div class="version">Worker version: ${escapeHtml(workerVersion)}</div>
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

function renderPinVerifyPage(
  session: PinSessionState,
  sessionToken: string,
  expiringSoon: boolean,
  expiresAtEpoch: number | null,
  workerVersion: string
): string {
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
    .secondary-link { display: inline-block; margin-top: 14px; color: #4e5f82; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; font-weight: 600; }
    .secondary-link[aria-disabled="true"] { color: #92a0bd; pointer-events: none; text-decoration: none; cursor: default; }
    .version { margin-top: 14px; color: #5d6f92; font-size: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
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
        <form action="/pin/setup" method="post" data-reset-form="1">
          <input type="hidden" name="session_token" value="${escapeHtml(sessionToken)}" />
        </form>
        <a href="#" class="secondary-link" data-reset-link="1">Reset PIN</a>
        <div class="version">Worker version: ${escapeHtml(workerVersion)}</div>
      </div>
    </div>
  </div>
  <script>
    (function () {
      var UNLOCK_MS = 12000;
      var forms = document.querySelectorAll('form[data-submit-guard]');
      var resetForm = document.querySelector('form[data-reset-form]');
      var resetLink = document.querySelector('[data-reset-link]');
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
      forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
          var target = event.currentTarget;
          if (!(target instanceof HTMLFormElement)) return;
          if (target.dataset.submitting === '1') {
            event.preventDefault();
            return;
          }
          target.dataset.submitting = '1';
          disableForm(target);
          if (resetLink instanceof HTMLElement) {
            resetLink.setAttribute('aria-disabled', 'true');
          }
          window.setTimeout(function () {
            unlockForm(target);
            if (resetLink instanceof HTMLElement) {
              resetLink.setAttribute('aria-disabled', 'false');
            }
          }, UNLOCK_MS);
        });
      });
      if (resetLink instanceof HTMLElement && resetForm instanceof HTMLFormElement) {
        resetLink.addEventListener('click', function (event) {
          event.preventDefault();
          if (resetLink.getAttribute('aria-disabled') === 'true') return;
          resetLink.setAttribute('aria-disabled', 'true');
          resetForm.submit();
        });
      }
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
  statusMessage?: string;
  pinExpiringSoon: boolean;
  repostToken?: string;
  workerVersion: string;
}): string {
  const prUrl = `https://github.com/${input.repo}/pull/${input.pr}`;
  const pinWarning = input.pinExpiringSoon
    ? `<p style="background:#fff4e5;border:1px solid #ffd39b;border-radius:10px;padding:10px;color:#7a4a00;">Your signature PIN expires in less than 7 days. Renew it during your next signature flow.</p>`
    : "";
  const statusMessage = input.statusMessage
    ? `<p style="background:#eef5ff;border:1px solid #c9daf8;border-radius:10px;padding:10px;color:#21375f;">${escapeHtml(input.statusMessage)}</p>`
    : "";
  const repostAction = input.alreadySigned && input.repostToken
    ? `<form action="/attestation/repost" method="post" data-submit-guard="1">
        <input type="hidden" name="repost_token" value="${escapeHtml(input.repostToken)}" />
        <button class="btn" type="submit" data-processing-text="Re-posting...">Re-post Existing Attestation</button>
      </form>
      <p style="margin-top:10px;color:#5d6f92;font-size:13px;">Use this only to retrigger downstream automation from the already-recorded signature. It does not create a new signature.</p>`
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
    .btn { margin-top: 14px; border: none; border-radius: 10px; padding: 12px 16px; font-size: 15px; font-weight: 650; background: #0f3d7a; color: #fff; cursor: pointer; }
    .btn[disabled] { opacity: .68; cursor: not-allowed; }
    .version { margin-top: 14px; color: #5d6f92; font-size: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
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
        ${statusMessage}
        <div class="k">Repository / PR</div><div class="v">${escapeHtml(input.repo)} #${escapeHtml(input.pr)}</div>
        <div class="k">Signer</div><div class="v">${escapeHtml(input.signerFullName)} (@${escapeHtml(input.signer)})</div>
        <div class="k">Role / Meaning</div><div class="v">${escapeHtml(input.role)} / ${escapeHtml(input.meaning)}</div>
        <div class="k">Target Hash</div><div class="v">${escapeHtml(input.hash)}</div>
        <div class="k">Timestamp</div><div class="v">${escapeHtml(input.timestamp)}</div>
        <div class="k">Attestation ID</div><div class="v">${escapeHtml(input.attestationId || "n/a")}</div>
        ${repostAction}
        <p><a href="${escapeHtml(prUrl)}" rel="noreferrer">Open PR</a></p>
        <div class="version">Worker version: ${escapeHtml(input.workerVersion)}</div>
      </div>
    </div>
  </div>
  <script>
    (function () {
      var UNLOCK_MS = 12000;
      var forms = document.querySelectorAll('form[data-submit-guard]');
      if (!forms.length) return;
      forms.forEach(function (form) {
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
          window.setTimeout(function () {
            delete target.dataset.submitting;
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
          }, UNLOCK_MS);
        });
      });
    })();
  </script>
</body>
</html>`;
}

function renderErrorPage(input: ErrorPresentation, workerVersion: string): string {
  const nextSteps = input.nextSteps
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join("");
  const detailsBlock = input.technicalDetails
    ? `<details><summary>Technical details</summary><pre>${escapeHtml(input.technicalDetails)}</pre></details>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(input.title)}</title>
  <style>
    :root {
      --bg: #fff5f2;
      --card: #fffdfc;
      --ink: #402021;
      --muted: #7d5757;
      --line: #efc3bb;
      --accent: #8d2f25;
      --accent-soft: #fee3dd;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: radial-gradient(circle at top, #fffefd 0%, var(--bg) 62%, #f7e3de 100%); color: var(--ink); font: 16px/1.5 "Segoe UI", "Avenir Next", "Helvetica Neue", sans-serif; }
    .wrap { max-width: 860px; margin: 40px auto; padding: 0 18px; }
    .card { border: 1px solid var(--line); border-radius: 18px; background: var(--card); box-shadow: 0 18px 40px rgba(95, 30, 23, 0.08); overflow: hidden; }
    .head { padding: 22px 24px 18px; background: linear-gradient(135deg, #fff0ec, #ffe3dd); border-bottom: 1px solid var(--line); }
    .eyebrow { display: inline-block; margin-bottom: 8px; padding: 5px 9px; border-radius: 999px; background: rgba(141, 47, 37, 0.10); color: var(--accent); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
    h1 { margin: 0; font-size: 28px; line-height: 1.15; letter-spacing: -0.02em; }
    .summary { margin: 10px 0 0; color: var(--muted); font-size: 17px; }
    .body { padding: 22px 24px 24px; }
    h2 { margin: 0 0 10px; font-size: 15px; text-transform: uppercase; letter-spacing: .06em; color: var(--accent); }
    ul { margin: 0; padding-left: 20px; }
    li + li { margin-top: 8px; }
    details { margin-top: 18px; border: 1px solid var(--line); border-radius: 12px; background: #fff7f5; overflow: hidden; }
    summary { cursor: pointer; padding: 12px 14px; font-weight: 650; }
    pre { margin: 0; padding: 0 14px 14px; white-space: pre-wrap; word-break: break-word; color: #5b2f2b; font: 13px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .foot { margin-top: 20px; color: var(--muted); font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <div class="eyebrow">QMS Signature</div>
        <h1>${escapeHtml(input.title)}</h1>
        <p class="summary">${escapeHtml(input.summary)}</p>
      </div>
      <div class="body">
        <h2>What To Do Next</h2>
        <ul>${nextSteps}</ul>
        ${detailsBlock}
        <div class="foot">Worker version: ${escapeHtml(workerVersion)}</div>
      </div>
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

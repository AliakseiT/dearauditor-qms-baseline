interface Env {
  PUBLIC_BASE_URL: string;
  DEFAULT_OAUTH_PROVIDER?: string;
  ALLOWED_OAUTH_PROVIDERS?: string;
  GITHUB_APP_ID: string;
  GITHUB_APP_CLIENT_ID: string;
  GITHUB_APP_CLIENT_SECRET: string;
  GITHUB_APP_PRIVATE_KEY: string;
  GITHUB_APP_INSTALLATION_ID?: string;
  SIGNATURE_LINK_SECRET: string;
  SIGNATURE_STATE_SECRET: string;
  GITHUB_API_BASE_URL?: string;
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

interface SignedState {
  provider: string;
  full_name: string;
  ctx: SignatureContext;
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

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const HTML_HEADERS = { "content-type": "text/html; charset=utf-8" };

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

  const fullName = String(form.get("full_name") || "").trim();
  if (!fullName) {
    throw new Error("Full legal name is required.");
  }

  const state: SignedState = {
    provider,
    full_name: fullName,
    ctx: context,
    iat: nowEpoch(),
    exp_state: nowEpoch() + 10 * 60,
    nonce: randomHex(12),
  };
  const stateToken = await signState(state, env.SIGNATURE_STATE_SECRET);

  if (provider === "github") {
    const redirect = new URL("https://github.com/login/oauth/authorize");
    redirect.searchParams.set("client_id", env.GITHUB_APP_CLIENT_ID);
    redirect.searchParams.set("redirect_uri", `${stripTrailingSlash(env.PUBLIC_BASE_URL)}/auth/callback`);
    redirect.searchParams.set("state", stateToken);
    redirect.searchParams.set("scope", "read:user");
    redirect.searchParams.set("allow_signup", "false");
    redirect.searchParams.set("prompt", "select_account");
    redirect.searchParams.set("login", context.signer);
    return Response.redirect(redirect.toString(), 302);
  }

  throw new Error(`Provider '${provider}' is not yet implemented.`);
}

async function handleAuthCallback(request: Request, env: Env): Promise<Response> {
  assertBaseConfig(env);

  const url = new URL(request.url);
  const code = (url.searchParams.get("code") || "").trim();
  const stateToken = (url.searchParams.get("state") || "").trim();
  if (!code || !stateToken) {
    throw new Error("Missing OAuth callback parameters.");
  }

  const state = await verifyState(stateToken, env.SIGNATURE_STATE_SECRET);
  if (state.exp_state < nowEpoch()) {
    throw new Error("Sign session expired. Open your PR signing link again.");
  }

  if (state.provider !== "github") {
    throw new Error(`Provider '${state.provider}' is not yet implemented.`);
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

  const appToken = await getRepoInstallationToken(state.ctx.repo, env);
  const requestMeta = await resolveLatestRequestComment(state.ctx.repo, Number.parseInt(state.ctx.pr, 10), appToken, env);
  validateRequestAgainstContext(requestMeta, state.ctx);

  const duplicate = await findExistingAttestation(state.ctx, signerLogin, appToken, env);
  if (duplicate) {
    return html(renderSuccessPage({
      repo: state.ctx.repo,
      pr: state.ctx.pr,
      hash: state.ctx.hash,
      meaning: state.ctx.meaning,
      role: state.ctx.role,
      signer: signerLogin,
      signerFullName: state.full_name,
      timestamp: new Date().toISOString(),
      attestationId: duplicate.attestation_id,
      alreadySigned: true,
    }), 200);
  }

  const signerProfile = await readSignerProfile(state.ctx.repo, signerLogin, appToken, env);
  const expectedName = (signerProfile.full_name || "").trim();
  if (expectedName && normalizeName(expectedName) !== normalizeName(state.full_name)) {
    throw new Error(
      `Full name does not match signer registry for @${signerLogin}. Expected '${expectedName}'.`
    );
  }

  const timestamp = new Date().toISOString();
  const attestationId = randomHex(16);
  const attestation = {
    version: "PART11-CF-WORKER-V1",
    mode: "cloudflare_worker_github_oauth",
    repository: state.ctx.repo,
    pr_number: Number.parseInt(state.ctx.pr, 10),
    commit_hash: state.ctx.hash,
    meaning_of_signature: state.ctx.meaning,
    signer_role: state.ctx.role,
    signer_full_name: state.full_name,
    signer_job_title: signerProfile.job_title || "",
    user_id: signerLogin,
    actor_id: Number(user.id || 0),
    timestamp,
    attestation_id: attestationId,
    required_signatures: Number.parseInt(state.ctx.required_signatures, 10),
    signature_index: Number.parseInt(state.ctx.signature_index, 10),
    request_comment_id: requestMeta.commentId,
    request_comment_url: requestMeta.commentUrl,
    auth_method: "GitHub OAuth via QMS Lite Sign App",
    linked_to_record: {
      type: "pull_request",
      number: Number.parseInt(state.ctx.pr, 10),
      repo: state.ctx.repo,
      hash: state.ctx.hash,
    },
  };

  const body = [
    "<!-- SIGNATURE_ATTESTATION_V1 -->",
    "```json",
    JSON.stringify(attestation, null, 2),
    "```",
  ].join("\n");

  await githubPost(
    `/repos/${state.ctx.repo}/issues/${state.ctx.pr}/comments`,
    appToken,
    { body },
    env
  );

  return html(renderSuccessPage({
    repo: state.ctx.repo,
    pr: state.ctx.pr,
    hash: state.ctx.hash,
    meaning: state.ctx.meaning,
    role: state.ctx.role,
    signer: signerLogin,
    signerFullName: state.full_name,
    timestamp,
    attestationId,
    alreadySigned: false,
  }), 200);
}

function assertBaseConfig(env: Env): void {
  const required = [
    "PUBLIC_BASE_URL",
    "GITHUB_APP_ID",
    "GITHUB_APP_CLIENT_ID",
    "GITHUB_APP_CLIENT_SECRET",
    "GITHUB_APP_PRIVATE_KEY",
    "SIGNATURE_LINK_SECRET",
    "SIGNATURE_STATE_SECRET",
  ] as const;
  for (const key of required) {
    const value = String(env[key] || "").trim();
    if (!value) {
      throw new Error(`Missing required configuration: ${key}`);
    }
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

async function signState(payload: SignedState, secret: string): Promise<string> {
  const encoded = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await hmacHexAsync(encoded, secret);
  return `${encoded}.${signature}`;
}

async function verifyState(token: string, secret: string): Promise<SignedState> {
  const parts = token.split(".");
  if (parts.length !== 2) throw new Error("Invalid state token.");
  const [encoded, sig] = parts;
  const expected = await hmacHexAsync(encoded, secret);
  if (!timingSafeEqual(expected, sig.toLowerCase())) {
    throw new Error("Invalid state signature.");
  }
  const bytes = base64UrlDecode(encoded);
  const parsed = JSON.parse(new TextDecoder().decode(bytes)) as SignedState;
  if (!parsed?.ctx || !parsed?.full_name || !parsed?.provider) {
    throw new Error("Invalid state payload.");
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
      client_id: env.GITHUB_APP_CLIENT_ID,
      client_secret: env.GITHUB_APP_CLIENT_SECRET,
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

async function getRepoInstallationToken(repo: string, env: Env): Promise<string> {
  const appJwt = await buildGithubAppJwt(env.GITHUB_APP_ID, env.GITHUB_APP_PRIVATE_KEY);
  let installationId = Number.parseInt(String(env.GITHUB_APP_INSTALLATION_ID || ""), 10);

  if (!Number.isFinite(installationId) || installationId < 1) {
    const installation = await githubGet<{ id: number }>(`/repos/${repo}/installation`, appJwt, env, true);
    installationId = Number(installation.id);
  }

  const tokenRes = await githubPost<{ token: string }>(
    `/app/installations/${installationId}/access_tokens`,
    appJwt,
    {},
    env,
    true
  );
  if (!tokenRes.token) throw new Error("Failed to mint GitHub App installation token.");
  return tokenRes.token;
}

async function buildGithubAppJwt(appId: string, privateKeyPem: string): Promise<string> {
  const now = nowEpoch();
  const header = { alg: "RS256", typ: "JWT" };
  const payload = { iat: now - 30, exp: now + 9 * 60, iss: appId };

  const headerB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const data = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(data));
  const signatureB64 = base64UrlEncode(new Uint8Array(signature));
  return `${data}.${signatureB64}`;
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
    throw new Error("Signing context hash does not match current request hash.");
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

async function githubGet<T>(path: string, token: string, env: Env, asAppJwt = false): Promise<T> {
  const res = await fetch(`${githubApiBase(env)}${path}`, {
    method: "GET",
    headers: githubHeaders(token, asAppJwt),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API GET ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

async function githubPost<T>(path: string, token: string, payload: unknown, env: Env, asAppJwt = false): Promise<T> {
  const res = await fetch(`${githubApiBase(env)}${path}`, {
    method: "POST",
    headers: {
      ...githubHeaders(token, asAppJwt),
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

function githubHeaders(token: string, asAppJwt = false): Record<string, string> {
  return {
    authorization: `${asAppJwt ? "Bearer" : "token"} ${token}`,
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

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const cleaned = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\s+/g, "");
  const bytes = base64ToBytes(cleaned);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
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

function normalizeName(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
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
    .foot { font-size: 12px; color: var(--muted); }
    a { color: #1b4ea4; }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="head">
        <h1>Part 11 Signature Title Page</h1>
        <p>Identity is verified by ${escapeHtml(providerLabel)} login. Signature context is locked from the PR request.</p>
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
        <form action="${escapeHtml(formAction)}" method="post">
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
          <label for="full_name">Signer full legal name</label>
          <input id="full_name" name="full_name" type="text" autocomplete="name" placeholder="e.g., Aliaksei Tsitovich" required />
          <div class="hint">Only this field is entered manually. All signing context is locked and verified by the backend.</div>
          <button class="btn" type="submit">Sign with ${escapeHtml(providerLabel)}</button>
        </form>
      </div>
      <div class="section foot">
        PR: <a href="${escapeHtml(prUrl)}" target="_blank" rel="noreferrer">${escapeHtml(prUrl)}</a>
      </div>
    </div>
  </div>
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
}): string {
  const prUrl = `https://github.com/${input.repo}/pull/${input.pr}`;
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
        <div class="k">Repository / PR</div><div class="v">${escapeHtml(input.repo)} #${escapeHtml(input.pr)}</div>
        <div class="k">Signer</div><div class="v">${escapeHtml(input.signerFullName)} (@${escapeHtml(input.signer)})</div>
        <div class="k">Role / Meaning</div><div class="v">${escapeHtml(input.role)} / ${escapeHtml(input.meaning)}</div>
        <div class="k">Target Hash</div><div class="v">${escapeHtml(input.hash)}</div>
        <div class="k">Timestamp</div><div class="v">${escapeHtml(input.timestamp)}</div>
        <div class="k">Attestation ID</div><div class="v">${escapeHtml(input.attestationId || "n/a")}</div>
        <p><a href="${escapeHtml(prUrl)}" target="_blank" rel="noreferrer">Open PR</a></p>
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

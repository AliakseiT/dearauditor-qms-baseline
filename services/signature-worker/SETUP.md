# QMS Lite Sign Setup

## 1. GitHub OAuth App Configuration

OAuth app name: `QMS Lite Signature`

- Homepage URL: `https://sign.qms.dearauditor.ch`
- Callback URL: `https://sign.qms.dearauditor.ch/auth/callback`
- Scope used by worker: `read:user`

## 2. GitHub App Configuration for Automation

GitHub App name: `qms-lite-bot`

Repository permissions:

- `Contents: Read and write`
- `Pull requests: Read and write`
- `Issues: Read and write`
- `Metadata: Read-only`

Optional later permission if project sync is moved under the bot:

- `Repository projects: Read and write`

The worker uses this app only for repository-side automation such as reading signer/request comments and posting final attestation comments. The signer-facing login remains the separate OAuth app above.

## 3. Cloudflare Worker Configuration

Worker vars:

- `PUBLIC_BASE_URL=https://sign.qms.dearauditor.ch`
- `DEFAULT_OAUTH_PROVIDER=github`
- `ALLOWED_OAUTH_PROVIDERS=github`

Worker secrets:

- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`
- `QMS_BOT_APP_ID`
- `QMS_BOT_APP_PRIVATE_KEY`
- optional `QMS_BOT_APP_INSTALLATION_ID`
- `SIGNATURE_LINK_SECRET`
- `SIGNATURE_STATE_SECRET`
- `PIN_PEPPER`
- legacy fallback only: `GITHUB_REPO_TOKEN`

KV binding in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "PIN_KV"
id = "<prod-namespace-id>"
preview_id = "<preview-namespace-id>"
```

## 4. qms-lite Repository Settings

Repository variable:

- `SIGNATURE_UI_BASE_URL=https://sign.qms.dearauditor.ch`

Repository secrets:

- `QMS_BOT_APP_ID`
- `QMS_BOT_APP_PRIVATE_KEY`
- `SIGNATURE_LINK_SECRET` (must match worker secret)
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- temporary legacy fallback: `SIGNATURE_APP_ID`, `SIGNATURE_APP_PRIVATE_KEY`

## 5. Worker Runtime Keys Checklist

Worker secrets / vars required for the preferred future setup:

- `PUBLIC_BASE_URL`
- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`
- `QMS_BOT_APP_ID`
- `QMS_BOT_APP_PRIVATE_KEY`
- `SIGNATURE_LINK_SECRET`
- `SIGNATURE_STATE_SECRET`
- `PIN_PEPPER`
- `PIN_KV` binding in `wrangler.toml`

Optional:

- `QMS_BOT_APP_INSTALLATION_ID`
- `GITHUB_API_BASE_URL`
- `GITHUB_REPO_TOKEN` only as temporary backward-compatible fallback

## 6. Deploy

Manual:

- `cd services/signature-worker`
- `npm install`
- `npm run deploy`

GitHub Actions:

- run workflow `Deploy Signature Worker` manually (`workflow_dispatch`)

## 7. One-Command Bootstrap

From repo root:

- `./services/signature-worker/scripts/bootstrap_env.sh --deploy`

This syncs `.env.local` values to GitHub/Cloudflare, validates KV IDs, and deploys worker. The bootstrap script now supports the preferred `QMS_BOT_APP_*` settings and still accepts the legacy repo-token fallback during migration.

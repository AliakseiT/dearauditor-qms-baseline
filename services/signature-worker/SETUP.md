# DearAuditor Open QMS Baseline Sign Setup

## 1. GitHub OAuth App Configuration

Suggested OAuth app name: `DearAuditor Open QMS Baseline Sign`

- Homepage URL: `https://sign.qms.dearauditor.ch`
- Callback URL: `https://sign.qms.dearauditor.ch/auth/callback`
- Scope used by worker: `read:user`

## 2. Cloudflare Worker Configuration

Worker vars:

- `PUBLIC_BASE_URL=https://sign.qms.dearauditor.ch`
- `DEFAULT_OAUTH_PROVIDER=github`
- `ALLOWED_OAUTH_PROVIDERS=github`
- `REPO_ALIASES_JSON={"AliakseiT/qms-lite":"AliakseiT/dearauditor-qms-baseline"}` (optional; add old-slug to current-slug mappings after repo renames)

Worker name:

- default: `signature-worker`
- optional override: `SIGNATURE_WORKER_NAME=<your preferred worker name>`
- optional CLI override for bootstrap: `./services/signature-worker/scripts/bootstrap_env.sh --worker-name <your preferred worker name>`

If you temporarily use a `workers.dev` URL before switching to a custom domain, the Worker name becomes part of the public URL:

- `https://<worker-name>.<account-subdomain>.workers.dev`

Worker secrets:

- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`
- `QMS_BOT_APP_ID`
- `QMS_BOT_APP_PRIVATE_KEY`
- `QMS_BOT_APP_INSTALLATION_ID` (optional)
- `SIGNATURE_STATE_SECRET`
- `PIN_PEPPER`

KV binding in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "PIN_KV"
id = "<prod-namespace-id>"
preview_id = "<preview-namespace-id>"

[vars]
PUBLIC_BASE_URL = "https://sign.example.com"
```

The committed `wrangler.toml` in this repository uses placeholders. Replace them before deploy, or let `./services/signature-worker/scripts/bootstrap_env.sh` write the values from `.env.local`.

## 3. GitHub App Requirements

Use a GitHub App installation for repository access. Minimum repository permissions:

- Issues: `Read and write`
- Pull requests: `Read-only`
- Contents: `Read-only`
- Workflows: `Read and write`
- Metadata: `Read-only`

The workflow permission is required because the repository uses the GitHub App token for automation that may merge PRs touching `.github/workflows/`.

## 4. Repository Settings

Repository variable:

- `SIGNATURE_WORKER_NAME=<cloudflare worker name>` (optional; defaults to `signature-worker`)
- `SIGNATURE_UI_BASE_URL=https://sign.qms.dearauditor.ch`
- `PIN_KV_NAMESPACE_ID=<cloudflare kv namespace id>`
- `PIN_KV_PREVIEW_NAMESPACE_ID=<cloudflare kv preview namespace id>`
- `SIGNATURE_REPO_ALIASES_JSON={"AliakseiT/qms-lite":"AliakseiT/dearauditor-qms-baseline"}` (optional; recommended after repo renames)

Repository secrets:

- `QMS_BOT_APP_ID`
- `QMS_BOT_APP_PRIVATE_KEY`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 5. Deploy

Manual:

- `cd services/signature-worker`
- `npm ci`
- `npm run deploy`

The deploy command injects `WORKER_VERSION` automatically using the format `YYYY-MM-DD-<short git hash>` in UTC, and the active version is shown in the worker UI and `/healthz`.

GitHub Actions:

- run workflow `4.1 Deploy Signature Worker` manually (`workflow_dispatch`)
- the workflow materializes `wrangler.toml` from repo variables `SIGNATURE_WORKER_NAME`, `SIGNATURE_UI_BASE_URL`, `PIN_KV_NAMESPACE_ID`, `PIN_KV_PREVIEW_NAMESPACE_ID`, and optionally `SIGNATURE_REPO_ALIASES_JSON` before deploy

## 6. One-Command Bootstrap

From repo root:

- `./services/signature-worker/scripts/bootstrap_env.sh --deploy`

This syncs `.env.local` values to GitHub/Cloudflare, validates KV IDs, and deploys worker.

## 7. Hosted Alternative

If an adopter does not want to self-host the worker, `https://sign.qms.dearauditor.ch` may be usable as a hosted signing endpoint by separate arrangement. In that model, the adopter would still need the repository-side GitHub configuration expected by DearAuditor Open QMS Baseline, while commercial terms and service conditions remain outside this setup guide.

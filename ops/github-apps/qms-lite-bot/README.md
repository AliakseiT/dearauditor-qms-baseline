# qms-lite-bot GitHub App

## Purpose
`qms-lite-bot` is the GitHub App used for repository automation in QMS Lite:
- PR comments for signatory assignment and signature requests
- PR merge automation
- immutable release publication
- attestation posting from the Cloudflare signature worker

It is separate from the `QMS Lite Signature` OAuth app, which is only used to identify the human signer in the browser-based PIN ceremony.

## MVP Ownership Model
For MVP, the app may be owned by the personal GitHub account `AliakseiT`.

Target future state:
- transfer ownership to the company GitHub organization
- keep the same app purpose and slug if available
- rotate the private key after transfer

## Source of Truth
This directory is the operational baseline for the app:
- [manifest.json](/Users/aliaksei/workspace/qms-lite/ops/github-apps/qms-lite-bot/manifest.json): GitHub App manifest to use when creating or re-creating the app
- this runbook: lifecycle and maintenance procedure

The manifest is treated as configuration-as-code. GitHub App registration itself is still applied manually in GitHub settings.

Logo note:
- GitHub App badge/logo is not part of the manifest flow.
- GitHub requires manual badge upload in app settings.
- GitHub expects a `PNG`, `JPG`, or `GIF` badge upload.
- SVG can still be kept in Git as the editable source asset.

## Current MVP Configuration
- App owner: `AliakseiT`
- App visibility: private
- Installation target: `AliakseiT/qms-lite`
- Webhook: not required for MVP
- OAuth-on-install: disabled
- Badge source asset: [assets/qms-lite-bot-badge.svg](/Users/aliaksei/workspace/qms-lite/ops/github-apps/qms-lite-bot/assets/qms-lite-bot-badge.svg)

## Required Permissions
Current minimum repository permissions:
- `Contents: Read and write`
- `Pull requests: Read and write`
- `Issues: Read and write`
- `Metadata: Read-only`

Do not grant broader permissions unless a concrete automation requires them and the change is reviewed through a PR.

## Create the App
Recommended path:
1. Sign in as `AliakseiT`.
2. Open GitHub App settings and choose to create an app from a manifest.
3. Paste the contents of [manifest.json](/Users/aliaksei/workspace/qms-lite/ops/github-apps/qms-lite-bot/manifest.json).
4. Confirm the app name is `qms-lite-bot` or adjust only if GitHub reports a naming conflict.
5. Create the app.
6. Install it on `AliakseiT/qms-lite` only.
7. Generate a private key and store it in the secret manager used for QMS Lite deployment.
8. Export [assets/qms-lite-bot-badge.svg](/Users/aliaksei/workspace/qms-lite/ops/github-apps/qms-lite-bot/assets/qms-lite-bot-badge.svg) to a square `PNG` and upload it as the app badge in GitHub settings.

## Secrets and Variables to Populate
Repository or deployment configuration must receive:
- `QMS_BOT_APP_ID`
- `QMS_BOT_APP_PRIVATE_KEY`
- optional `QMS_BOT_APP_INSTALLATION_ID`

The installation ID is not a separate app. It is only the installation identifier for `qms-lite-bot` and can be omitted if runtime discovery is preferred.

## How to Obtain the Installation ID
Optional process:
1. Open the installed `qms-lite-bot` app.
2. Open the installation for `AliakseiT/qms-lite`.
3. Copy the installation ID from the URL or GitHub UI metadata.

If omitted, the worker resolves the installation dynamically from the repo.

## Maintenance Model
Use this change model:
1. Update [manifest.json](/Users/aliaksei/workspace/qms-lite/ops/github-apps/qms-lite-bot/manifest.json) in a PR.
2. Review the permission/event delta like any other controlled configuration change.
3. After merge, a GitHub App manager applies the same change manually in the GitHub App settings.
4. Record the applied date in the relevant PR or release note if the change affects production automation behavior.

This keeps the reviewed manifest in Git even though GitHub App registration is not fully declarative.

## Private Key Rotation
Use overlapping rotation:
1. Generate a new private key in GitHub App settings.
2. Replace `QMS_BOT_APP_PRIVATE_KEY` in the deployment secret store.
3. Redeploy or re-run the dependent automation setup if needed.
4. Verify that the worker and GitHub Actions can still mint installation tokens.
5. Delete the old private key from the app settings.

## Transfer to Organization Later
When MVP ends:
1. Transfer app ownership from `AliakseiT` to the company GitHub organization.
2. Confirm the installation target and permissions after transfer.
3. Generate a new private key.
4. Update `QMS_BOT_APP_ID`, `QMS_BOT_APP_PRIVATE_KEY`, and optional installation ID in secrets.
5. Re-test worker signing, PR comment posting, merge automation, and immutable release publication.

## Change Control Notes
- Keep the app private unless there is a clear need for wider distribution.
- Keep installations scoped to the minimum repository set.
- Do not enable webhooks unless a concrete automation path requires GitHub App webhook delivery.
- Treat permission expansion as a controlled change requiring explicit review.

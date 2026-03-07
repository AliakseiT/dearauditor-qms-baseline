# Workflow Automation Map

This is the text-native source of truth for the QMS Lite automation topology. GitHub renders the Mermaid diagram directly, so the map stays readable in pull requests and easier to maintain than a hand-edited SVG.

```mermaid
flowchart LR
  subgraph triggers["Primary Triggers"]
    pr_open["pull_request<br/>(open/update)"]
    pr_review["pull_request_review"]
    pr_closed["pull_request<br/>(closed)"]
    qms_tag["push tag<br/>(QMS-YYYY-MM-DD-RNN)"]
    issue_events["issues / issue_comment"]
    manual["workflow_dispatch"]
  end

  subgraph pr_controls["1 PR Controls and Approval Gates"]
    w11["1.1 auto assign signatory reviewers<br/>1.1_auto_assign_signatory_reviewers.yml"]
    w12["1.2 required reviewer approval gate<br/>1.2_required_reviewer_approval_gate.yml"]
    w13["1.3 auto merge after signatory approvals<br/>1.3_auto_merge_after_signatory_approvals.yml"]
    w14["1.4 qms content gate<br/>1.4_qms_content_gate.yml<br/>Includes risk-record schema validation"]
  end

  subgraph signature_pub["2 Signature and Publication Gates"]
    w21["2.1 PR signature request gate<br/>2.1_pr_signature_request_gate.yml"]
    signer_ui["Signature worker<br/>(Cloudflare Worker + GitHub OAuth + PIN)"]
    w24["2.4 signature attestation title page<br/>2.4_signature_attestation_title_page.yml"]
    w22["2.2 publish QMS records<br/>2.2_publish_qms_records.yml"]
    w23["2.3 publish QMS release<br/>2.3_publish_qms_release.yml"]
    w25["2.5 signature git-native fallback<br/>2.5_signature_git_native_fallback.yml"]
  end

  subgraph training["3 Training Lifecycle"]
    w31["3.1 release training diff<br/>3.1_release_training_diff.yml"]
    w32["3.2 training issue signature flow<br/>3.2_training_issue_signature_flow.yml"]
  end

  subgraph platform["4 Platform and Maintenance"]
    w41["4.1 deploy signature worker<br/>4.1_deploy_signature_worker.yml"]
    w42["4.2 artifact quota cleanup<br/>4.2_artifact_quota_cleanup.yml"]
  end

  pr_open --> w11
  pr_open --> w14
  pr_review --> w12
  pr_review --> w13
  pr_closed --> w21
  pr_closed --> w22
  qms_tag --> w23
  qms_tag --> w31
  issue_events --> w24
  issue_events --> w32
  manual --> w21
  manual --> w25
  manual --> w31
  manual --> w32
  manual --> w41
  manual --> w42

  w21 --> signer_ui
  signer_ui --> w24
  signer_ui --> w22
  signer_ui -. fallback unavailable .-> w25
  w31 --> w32
```

## Notes

- `1.4_qms_content_gate.yml` is the consolidated content sanity check. It covers README/index synchronization, training-matrix synchronization, configured record-index checks, and risk-register schema validation.
- Training now uses a single issue-based path: `3.1` creates consolidated per-user training issues and `3.2` manages their signature and closure flow.
- The manual signature fallback remains available only as a break-glass path if the primary signature worker flow is unavailable.

---
sop_id: SOP-017
title: Infrastructure and Maintenance Control
revision: R03
effective_date: 2026-03-18
status: Published
owner_role: engineering_lead
approver_role: qa_lead
related_issue: "#25"
---
## 1. Purpose
Define controls for infrastructure and maintenance activities that support reliable QMS operations and safe/effective software product lifecycle execution.

## 2. Scope
Applies to infrastructure supporting development, testing, release, and QMS record systems. Product runtime infrastructure controls remain defined per product dossier.

## 3. Inputs
- Infrastructure architecture records
- Security/reliability requirements
- Incident/problem history and supplier dependencies

## 4. Outputs
- Controlled maintenance plan and execution records
- Infrastructure risk mitigations and continuity evidence
- Updated product-specific infrastructure controls when required

## 5. Roles and Responsibilities
| Role | Responsibilities |
|---|---|
| Engineering Lead | Operates and maintains infrastructure components and runbooks. |
| Technical QMS Maintainer | Maintains shared automation, workflow configuration, and evidence-preservation mechanisms supporting QMS operations. |
| QA Lead | Ensures controls are documented and evidence is retained. |
| Management Representative | Approves major infrastructure policy changes. |

## 6. Procedure

### 6.1 Infrastructure Boundary Definition
1. Define shared infrastructure used for QMS and product lifecycle operations.
2. For each product, maintain product-specific runtime infrastructure description in product dossier.
3. Do not apply a single intended-use infrastructure assumption across all products.

### 6.2 Maintenance Planning
1. Maintain routine maintenance calendar (updates, backups, certificate/key rotations, access reviews).
2. Prioritize maintenance by risk/criticality.
3. Define fallback/rollback approach for critical maintenance actions.

### 6.3 Access and Environment Controls
1. Enforce role-based access and least privilege.
2. Review privileged access at least quarterly.
3. Record environment changes and approvals through change control.

### 6.4 Monitoring and Incident Handling
1. Monitor service health, backup status, and critical workflow failures.
2. Escalate incidents with quality impact to CAPA and management review where needed.
3. Verify restoration capability through periodic recovery tests.

### 6.5 Supplier/Service Dependency Governance
1. Ensure infrastructure suppliers are approved under SOP-010.
2. Track supplier status changes for continuity and compliance impact.

## 7. Required Records
- Infrastructure maintenance log
- Access review records
- Recovery test evidence
- Infrastructure-related incident and action records

## 8. Traceability
| ISO 13485 Clause | Control in this SOP |
|---|---|
| 6.3 | Defines infrastructure determination, provision, and maintenance controls. |
| 6.4 | Defines environmental/work-condition controls supporting conformity. |

## 9. Related Controlled Documents
- SOP-009 Change Management
- SOP-010 Supplier and Purchasing Control
- SOP-006 Software Validation (QMS Tools)

## 10. Revision History
| Revision | Effective Date | Change Summary |
|---|---|---|
| R00 | 2026-03-02 | Initial full release. |
| R01 | 2026-03-07 | Normalized infrastructure accountability to the controlled engineering-owner role and added technical QMS maintainer responsibilities for shared automation. |
| R02 | 2026-03-07 | Renamed the accountable engineering role to `engineering_lead` in the simplified role taxonomy. |
| R03 | 2026-03-18 | Removed top-table standards clause metadata; normative references remain in the Traceability section. |

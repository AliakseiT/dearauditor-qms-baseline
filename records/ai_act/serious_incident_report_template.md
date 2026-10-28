# Serious Incident Report (AI Act) — Reg. (EU) 2024/1689 Art. 73
record_type: ai_act_serious_incident
report_id: "SIR-AI-<product>-<yyyy-mm-dd>-<nn>"
product: {{product_id}}
ai_system: {{ai_system_id}}
incident_categories: [death_or_health_harm | critical_infrastructure_disruption | fundamental_rights_infringement | property_or_environment_harm]  # Art. 3(49)(a)-(d); list every category that applies
widespread_infringement: [yes | no]  # Art. 3(61)
device_scope_limited: [yes | no]  # Art. 73(10): MDR/IVDR device or safety component; AI Act notification covers 3(49)(c) only, other categories go to SOP-013 vigilance
incident_occurred_on: {{yyyy-mm-dd hh:mm}}
became_aware_on: {{yyyy-mm-dd hh:mm}}  # starts every statutory clock
became_aware_by: [provider | deployer] {{organisation and person}}
causal_link_established_or_suspected_on: {{yyyy-mm-dd hh:mm}}
internal_triage_completed_on: {{yyyy-mm-dd hh:mm}}
deadline_class: [two_days_widespread_infringement_or_critical_infrastructure | ten_days_death | fifteen_days_other]  # shortest applicable class governs
statutory_deadline: {{became_aware_on + 2, 10, or 15 days}}
authority: {{market surveillance authority, or national competent authority under Art. 73(10)}}
initial_report_submitted_on: {{yyyy-mm-dd hh:mm or n/a}}
complete_report_submitted_on: {{yyyy-mm-dd hh:mm}}
report_type: [initial_incomplete | complete]

## Incident description
## Affected persons and systems
## Severity assessment
## Root cause analysis
## Containment actions taken
## Corrective actions
## Authority interactions
## Review board sign-off

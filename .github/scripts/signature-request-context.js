'use strict';

// Shared parser for QMS signature request comments.
//
// Signature request comments (posted by workflows 2.1, 2.7, and 3.2) carry
// the same signing context twice:
//
//   1. A structured machine block (authoritative):
//        <!-- SIGNATURE_REQUEST_CONTEXT_V1
//        { "hash": "...", "meaning": "...", "required_signatures": "2",
//          "signers": [{ "signer": "login", "role": "...", "signature_index": "1" }] }
//        -->
//   2. A human-readable "Technical details" list. Markdown before PR #412
//      ("Meaning of signature: **...**", "Target hash (...): `...`"),
//      HTML after it ("<strong>...</strong>", "<code>...</code>").
//
// PR #412 switched the human-readable list from Markdown to HTML and broke
// every consumer that hard-required the Markdown shapes even when the
// structured block parsed (2.6 stopped applying signature labels, which
// blocked the QMS-2026-07-09-R005 release tag until manual intervention).
// Consumers must prefer the structured block and treat the text list only as
// a fallback that accepts BOTH the Markdown and HTML shapes. This module is
// the single source of truth for that parsing; pure JS (no extra toolchain);
// unit-tested in signature-request-context.test.js.

const HASH_PATTERN = /^[a-f0-9]{64}$/;

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Match "Label: **value**" (Markdown) or "Label: <strong>value</strong>" (HTML).
function matchEmphasisValue(body, label) {
  const source = String(body || '');
  const prefix = escapeRegExp(label) + ':\\s*';
  const match = source.match(new RegExp(prefix + '\\*\\*([^*]+)\\*\\*', 'i'))
    || source.match(new RegExp(prefix + '<strong>([^<]+)</strong>', 'i'));
  return match ? match[1].trim() : '';
}

// Match "Target hash (scope): `hex`" (Markdown) or "... <code>hex</code>" (HTML).
function matchTargetHash(body) {
  const source = String(body || '');
  const match = source.match(/Target hash \([^)]+\):\s*`([a-f0-9]{64})`/i)
    || source.match(/Target hash \([^)]+\):\s*<code>([a-f0-9]{64})<\/code>/i);
  return match ? match[1].trim().toLowerCase() : '';
}

function parseStructuredContext(body) {
  const match = String(body || '').match(/<!--\s*SIGNATURE_REQUEST_CONTEXT_V1\s*([\s\S]*?)-->/i);
  if (!match || !match[1]) return null;
  try {
    const parsed = JSON.parse(match[1].trim());
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function normalizeSigners(structured) {
  if (!Array.isArray(structured?.signers)) return [];
  return structured.signers
    .map((entry) => {
      const signer = String(entry?.signer || '').trim().toLowerCase();
      const role = String(entry?.role || '').trim();
      const signatureIndex = String(entry?.signature_index || entry?.signatureIndex || '').trim() || '1';
      if (!signer || !role) return null;
      return { signer, role, signatureIndex };
    })
    .filter(Boolean);
}

// Returns { hash, meaning, requiredSignatures, roles, eligibleSigners, signers }
// or null when neither encoding yields both a target hash and a meaning.
function parseSignatureRequestContext(body) {
  const structured = parseStructuredContext(body);
  const signers = normalizeSigners(structured);

  const structuredHash = String(structured?.hash || '').trim().toLowerCase();
  const hash = HASH_PATTERN.test(structuredHash) ? structuredHash : matchTargetHash(body);

  // Legacy request comments carried the meaning in backticks; keep accepting
  // that shape (parity with the pre-existing 2.4/2.5 fallbacks).
  const legacyMeaningMatch = String(body || '').match(/Meaning of signature:\s*`([^`]+)`/i);
  const meaning = String(structured?.meaning || '').trim()
    || matchEmphasisValue(body, 'Meaning of signature')
    || (legacyMeaningMatch ? legacyMeaningMatch[1].trim() : '');

  if (!hash || !meaning) return null;

  const requiredParsed = Number.parseInt(
    String(
      structured?.required_signatures
        || structured?.requiredSignatures
        || matchEmphasisValue(body, 'Required signatures')
        || '1'
    ),
    10
  );
  const requiredSignatures = Number.isInteger(requiredParsed) && requiredParsed > 0 ? requiredParsed : 1;

  // Roles and eligible signers exist only in the human-readable list; the
  // structured block instead carries per-slot signer/role pairs (`signers`).
  const legacyRolesMatch = String(body || '').match(/Signer role\(s\):\s*`([^`]+)`/i);
  const roles = (matchEmphasisValue(body, 'Designated signatory role(s)')
    || (legacyRolesMatch ? legacyRolesMatch[1] : ''))
    .split(/[;,]/)
    .map((x) => x.trim())
    .filter(Boolean);
  const eligibleSigners = Array.from(
    matchEmphasisValue(body, 'Eligible signers').matchAll(/@([A-Za-z0-9-]+)/g)
  ).map((match) => match[1].toLowerCase());

  return { hash, meaning, requiredSignatures, roles, eligibleSigners, signers };
}

module.exports = {
  parseSignatureRequestContext,
  parseStructuredContext,
  matchEmphasisValue,
  matchTargetHash,
};

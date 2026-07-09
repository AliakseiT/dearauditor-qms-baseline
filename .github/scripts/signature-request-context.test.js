'use strict';

// Node-only unit test for the shared signature-request-context parser.
// Run: node this file. Single JS stack; no test framework needed.
const assert = require('assert');
const { parseSignatureRequestContext } = require('./signature-request-context.js');

const HASH = 'a'.repeat(24) + 'b'.repeat(24) + 'c'.repeat(16);

const STRUCTURED_BLOCK = [
  '<!-- signature-native-signature-request -->',
  '<!-- SIGNATURE_REQUEST_CONTEXT_V1',
  JSON.stringify(
    {
      version: 1,
      hash: HASH,
      hash_scope: 'pr_merge_state',
      record_type: 'pull_request',
      meaning: 'Approved QMS Change',
      required_signatures: '2',
      signers: [
        { signer: 'AliakseiT', role: 'Technical QMS Maintainer', signature_index: '1' },
        { signer: 'SorenAdalyon', role: 'QA Lead', signature_index: '2' },
      ],
    },
    null,
    2
  ),
  '-->',
].join('\n');

// Post-#412 human-readable shape (HTML inside <details>, as emitted by 2.1).
const HTML_DETAILS = [
  '<details><summary>Technical details for the QMS record</summary>',
  '<ul>',
  '<li>Meaning of signature: <strong>Approved QMS Change</strong></li>',
  '<li>Required signatures: <strong>2</strong></li>',
  '<li>Designated signatory role(s): <strong>Technical QMS Maintainer, QA Lead</strong></li>',
  '<li>Eligible signers: <strong>@AliakseiT, @SorenAdalyon</strong></li>',
  `<li>Target hash (PR merge state): <code>${HASH}</code></li>`,
  '</ul>',
  '</details>',
].join('\n');

// Pre-#412 human-readable shape (Markdown).
const MARKDOWN_DETAILS = [
  '- Meaning of signature: **Approved QMS Change**',
  '- Required signatures: **2**',
  '- Designated signatory role(s): **Technical QMS Maintainer, QA Lead**',
  '- Eligible signers: **@AliakseiT, @SorenAdalyon**',
  `- Target hash (PR merge state): \`${HASH}\``,
].join('\n');

function assertFullContext(r, label) {
  assert.ok(r, `${label}: should parse`);
  assert.strictEqual(r.hash, HASH, `${label}: hash`);
  assert.strictEqual(r.meaning, 'Approved QMS Change', `${label}: meaning`);
  assert.strictEqual(r.requiredSignatures, 2, `${label}: requiredSignatures`);
  assert.deepStrictEqual(r.roles, ['Technical QMS Maintainer', 'QA Lead'], `${label}: roles`);
  assert.deepStrictEqual(r.eligibleSigners, ['aliakseit', 'sorenadalyon'], `${label}: eligibleSigners`);
}

// The current real shape: structured block + HTML details (post-#412 comment
// from 2.1). This is the exact case that regressed: the structured block
// parsed, but the Markdown-only fallbacks returned null anyway.
let r = parseSignatureRequestContext(`${STRUCTURED_BLOCK}\n\nSignature required\n\n${HTML_DETAILS}`);
assertFullContext(r, 'structured+html');
assert.deepStrictEqual(
  r.signers,
  [
    { signer: 'aliakseit', role: 'Technical QMS Maintainer', signatureIndex: '1' },
    { signer: 'sorenadalyon', role: 'QA Lead', signatureIndex: '2' },
  ],
  'structured+html: signers normalized'
);

// HTML-only fallback (structured block absent).
assertFullContext(parseSignatureRequestContext(HTML_DETAILS), 'html-only');

// Markdown-only fallback (pre-#412 comments still on old PRs).
assertFullContext(parseSignatureRequestContext(MARKDOWN_DETAILS), 'markdown-only');

// Structured-only: no human-readable list at all. hash/meaning/required/
// signers come from the block; roles/eligibleSigners are simply empty.
r = parseSignatureRequestContext(STRUCTURED_BLOCK);
assert.ok(r, 'structured-only: should parse');
assert.strictEqual(r.hash, HASH);
assert.strictEqual(r.meaning, 'Approved QMS Change');
assert.strictEqual(r.requiredSignatures, 2);
assert.deepStrictEqual(r.roles, []);
assert.deepStrictEqual(r.eligibleSigners, []);
assert.strictEqual(r.signers.length, 2);

// Structured block wins over the text when both are present and disagree.
r = parseSignatureRequestContext(
  `${STRUCTURED_BLOCK}\n- Meaning of signature: **Something Else**\n- Required signatures: **9**`
);
assert.strictEqual(r.meaning, 'Approved QMS Change', 'structured meaning wins');
assert.strictEqual(r.requiredSignatures, 2, 'structured required_signatures wins');

// Malformed structured JSON degrades to the text fallback.
r = parseSignatureRequestContext(
  `<!-- SIGNATURE_REQUEST_CONTEXT_V1\n{not json}\n-->\n${MARKDOWN_DETAILS}`
);
assertFullContext(r, 'malformed-structured');
assert.deepStrictEqual(r.signers, [], 'malformed-structured: no signers');

// Uppercase structured hash is normalized to lowercase.
r = parseSignatureRequestContext(
  `<!-- SIGNATURE_REQUEST_CONTEXT_V1\n${JSON.stringify({ hash: HASH.toUpperCase(), meaning: 'X' })}\n-->`
);
assert.strictEqual(r.hash, HASH, 'uppercase structured hash normalized');

// Legacy backtick meaning shape (parity with pre-existing 2.4/2.5 fallbacks).
r = parseSignatureRequestContext(
  `Meaning of signature: \`Approved Quality Record\`\n- Target hash (PR merge state): \`${HASH}\``
);
assert.ok(r, 'legacy-backtick: should parse');
assert.strictEqual(r.meaning, 'Approved Quality Record');

// Invalid or missing pieces -> null (same contract 2.6 relied on).
assert.strictEqual(parseSignatureRequestContext(''), null, 'empty body');
assert.strictEqual(parseSignatureRequestContext('random comment text'), null, 'garbage body');
assert.strictEqual(
  parseSignatureRequestContext('- Meaning of signature: **Approved QMS Change**'),
  null,
  'meaning without hash'
);
assert.strictEqual(
  parseSignatureRequestContext(`- Target hash (PR merge state): \`${HASH}\``),
  null,
  'hash without meaning'
);

// Bad required_signatures values fall back to 1.
r = parseSignatureRequestContext(
  `<!-- SIGNATURE_REQUEST_CONTEXT_V1\n${JSON.stringify({ hash: HASH, meaning: 'X', required_signatures: '0' })}\n-->`
);
assert.strictEqual(r.requiredSignatures, 1, 'required_signatures 0 -> 1');
r = parseSignatureRequestContext(
  `<!-- SIGNATURE_REQUEST_CONTEXT_V1\n${JSON.stringify({ hash: HASH, meaning: 'X', required_signatures: 'many' })}\n-->`
);
assert.strictEqual(r.requiredSignatures, 1, 'non-numeric required_signatures -> 1');

console.log('signature-request-context: all assertions passed');

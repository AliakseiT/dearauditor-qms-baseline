'use strict';

// Node-only unit test for the shared signer-role matcher. Run: node this file.
// Single JS stack; no test framework needed.
const assert = require('assert');
const { matchRoleSlots } = require('./role-coverage.js');

const M = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([role, users]) => [role, users.map((u) => u.toLowerCase())]));

// #807 reproduction: Eng-first declaration, author qualifies for both, only a
// non-author engineer (Herman) approved -> author flexibly covers QA. Valid.
let r = matchRoleSlots(
  ['engineering_lead', 'qa_lead'],
  M({ engineering_lead: ['AliakseiT', 'herman-smith-socosm'], qa_lead: ['AliakseiT', 'SorenAdalyon'] }),
  'AliakseiT',
  ['herman-smith-socosm'],
  1,
);
assert.strictEqual(r.covered, true, '#807 should be covered');
assert.strictEqual(r.authorRoleId, 'qa_lead', 'author flexibly covers QA');

// Order-independent: reversed declaration, same approvers -> still covered.
for (const seq of [['engineering_lead', 'qa_lead'], ['qa_lead', 'engineering_lead']]) {
  assert.strictEqual(
    matchRoleSlots(
      seq,
      M({ engineering_lead: ['aliakseit', 'herman-smith-socosm'], qa_lead: ['aliakseit', 'sorenadalyon'] }),
      'aliakseit',
      ['herman-smith-socosm'],
      1,
    ).covered,
    true,
    `order ${seq}`,
  );
}

// No non-author approval -> author covers at most one of two slots -> blocked.
assert.strictEqual(
  matchRoleSlots(
    ['engineering_lead', 'qa_lead'],
    M({ engineering_lead: ['aliakseit'], qa_lead: ['aliakseit', 'sorenadalyon'] }),
    'aliakseit',
    [],
    1,
  ).covered,
  false,
);

// Author qualifies ONLY eng; only an engineer approves -> qa_lead unfillable
// (this is the protection the count gate lacked on #807).
const w = matchRoleSlots(
  ['engineering_lead', 'qa_lead'],
  M({ engineering_lead: ['aliakseit', 'herman-smith-socosm'], qa_lead: ['sorenadalyon'] }),
  'aliakseit',
  ['herman-smith-socosm'],
  1,
);
assert.strictEqual(w.covered, false);
assert.deepStrictEqual(w.missingRoleIds, ['qa_lead']);

// Automation author (no author): rrs == slots -> every slot needs a distinct
// non-author.
assert.strictEqual(
  matchRoleSlots(
    ['engineering_lead', 'qa_lead'],
    M({ engineering_lead: ['herman-smith-socosm', 'aliakseit'], qa_lead: ['sorenadalyon', 'aliakseit'] }),
    '',
    ['herman-smith-socosm', 'sorenadalyon'],
    2,
  ).covered,
  true,
);
assert.strictEqual(
  matchRoleSlots(
    ['engineering_lead', 'qa_lead'],
    M({ engineering_lead: ['herman-smith-socosm'], qa_lead: ['sorenadalyon'] }),
    '',
    ['herman-smith-socosm'],
    2,
  ).covered,
  false,
);

// Duplicate roles ("QA Lead; QA Lead") need two distinct qa signers.
assert.strictEqual(
  matchRoleSlots(['qa_lead', 'qa_lead'], M({ qa_lead: ['aliakseit', 'sorenadalyon'] }), 'aliakseit', ['sorenadalyon'], 1).covered,
  true,
);
assert.strictEqual(
  matchRoleSlots(['qa_lead', 'qa_lead'], M({ qa_lead: ['aliakseit', 'sorenadalyon'] }), 'aliakseit', [], 1).covered,
  false,
);

// rrs == slots -> author ineligible to self-cover even if qualified.
assert.strictEqual(
  matchRoleSlots(['engineering_lead', 'qa_lead'], M({ engineering_lead: ['aliakseit'], qa_lead: ['aliakseit'] }), 'aliakseit', [], 2).covered,
  false,
);

console.log('role-coverage: all assertions passed');

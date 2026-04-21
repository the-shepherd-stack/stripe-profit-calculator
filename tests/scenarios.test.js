import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildScenarioQuery,
  parseScenarioQuery,
  presets,
} from '../app/scenarios.js';

test('buildScenarioQuery emits a compact query string for shareable calculator states', () => {
  const query = buildScenarioQuery({
    listPrice: 49,
    productCost: 0,
    couponPercent: 10,
    vatPercent: 0,
    affiliatePercent: 0,
    refundRate: 2,
    stripePercent: 2.9,
    stripeFixed: 0.3,
  });

  assert.equal(
    query,
    '?listPrice=49&productCost=0&couponPercent=10&vatPercent=0&affiliatePercent=0&refundRate=2&stripePercent=2.9&stripeFixed=0.3'
  );
});

test('parseScenarioQuery restores numeric calculator inputs from a shared query string', () => {
  const parsed = parseScenarioQuery(
    '?listPrice=299&productCost=15&couponPercent=20&vatPercent=20&affiliatePercent=30&refundRate=5&stripePercent=2.9&stripeFixed=0.3'
  );

  assert.deepEqual(parsed, {
    listPrice: 299,
    productCost: 15,
    couponPercent: 20,
    vatPercent: 20,
    affiliatePercent: 30,
    refundRate: 5,
    stripePercent: 2.9,
    stripeFixed: 0.3,
  });
});

test('parseScenarioQuery ignores unknown fields and invalid numbers', () => {
  const parsed = parseScenarioQuery('?listPrice=abc&productCost=7&bonus=123');

  assert.deepEqual(parsed, {
    productCost: 7,
  });
});

test('presets expose outreach-ready scenario cards with labels and calculator values', () => {
  assert.deepEqual(presets[0], {
    slug: 'notion-template',
    label: 'Notion template',
    summary: '$49 digital template with a light refund reserve',
    values: {
      listPrice: 49,
      productCost: 0,
      couponPercent: 10,
      vatPercent: 0,
      affiliatePercent: 0,
      refundRate: 2,
      stripePercent: 2.9,
      stripeFixed: 0.3,
    },
  });
});

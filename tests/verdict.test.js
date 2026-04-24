import test from 'node:test';
import assert from 'node:assert/strict';

import { buildCostHighlights, buildScenarioVerdict } from '../app/verdict.js';

test('buildScenarioVerdict summarizes a profitable scenario in plain language', () => {
  const verdict = buildScenarioVerdict({
    netProfit: 40.84,
    profitMarginPercent: 54.45,
    breakEvenPrice: 11.49,
  });

  assert.deepEqual(verdict, {
    tone: 'positive',
    headline: 'You keep $40.84 from this sale.',
    detail:
      'That is a 54.45% margin after Stripe fees, VAT, affiliates, refunds, and product cost. Your break-even list price is $11.49.',
  });
});

test('buildScenarioVerdict warns when a scenario loses money but can still break even with a higher price', () => {
  const verdict = buildScenarioVerdict({
    netProfit: -10.59,
    profitMarginPercent: -105.9,
    breakEvenPrice: 20.92,
  });

  assert.deepEqual(verdict, {
    tone: 'warning',
    headline: 'This setup loses $10.59 per sale.',
    detail:
      'You need a list price of at least $20.92 to break even, or you need to cut costs before selling this offer.',
  });
});

test('buildScenarioVerdict warns when break-even is unreachable with the current fee stack', () => {
  const verdict = buildScenarioVerdict({
    netProfit: -4.2,
    profitMarginPercent: -8.4,
    breakEvenPrice: Infinity,
  });

  assert.deepEqual(verdict, {
    tone: 'warning',
    headline: 'This setup loses $4.20 per sale.',
    detail:
      'This mix of discounts and fees cannot reach break-even as entered. Lower the discount or fee load before you send traffic here.',
  });
});

test('buildCostHighlights ranks the biggest deductions for the current scenario', () => {
  const highlights = buildCostHighlights({
    vatAmount: 15,
    stripeFee: 2.91,
    affiliateFee: 22.5,
    refundReserve: 3.75,
    productCost: 5,
  });

  assert.deepEqual(highlights, [
    'Affiliate fee: $22.50',
    'VAT collected: $15.00',
    'Product cost: $5.00',
  ]);
});

test('buildCostHighlights skips zero-value deductions and still returns the top items', () => {
  const highlights = buildCostHighlights({
    vatAmount: 0,
    stripeFee: 1.75,
    affiliateFee: 0,
    refundReserve: 0.5,
    productCost: 0,
  });

  assert.deepEqual(highlights, [
    'Stripe fee: $1.75',
    'Refund reserve: $0.50',
  ]);
});

test('app recalculates while the visitor edits inputs', async () => {
  const { readFile } = await import('node:fs/promises');
  const appSource = await readFile(new URL('../app/app.js', import.meta.url), 'utf8');

  assert.match(appSource, /form\.addEventListener\('input', \(event\) => \{/);
  assert.match(appSource, /window\.clearTimeout\(pendingInputRun\)/);
  assert.match(appSource, /window\.setTimeout\(\(\) => \{/);
  assert.match(appSource, /runCalculation\(\);/);
});


test('buildScenarioVerdict avoids formatting an infinite break-even price in zero-profit copy', () => {
  const verdict = buildScenarioVerdict({
    netProfit: 0,
    profitMarginPercent: 0,
    breakEvenPrice: Infinity,
  });

  assert.equal(verdict.tone, 'positive');
  assert.match(verdict.headline, /You keep \$0\.00 from this sale\./);
  assert.doesNotMatch(verdict.detail, /break-even list price is/);
  assert.match(verdict.detail, /already at break-even|no higher price floor/i);
});

test('app source protects live input recalculation from temporary invalid number fields', async () => {
  const { readFile } = await import('node:fs/promises');
  const appSource = await readFile(new URL('../app/app.js', import.meta.url), 'utf8');

  assert.match(appSource, /form\.addEventListener\('input', \(event\) => \{/);
  assert.match(appSource, /try \{\s*runCalculation\(\);\s*\} catch \(error\) \{/s);
});

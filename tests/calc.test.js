import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateScenario, roundMoney } from '../app/calc.js';

test('roundMoney rounds to cents using normal currency rules', () => {
  assert.equal(roundMoney(12.345), 12.35);
  assert.equal(roundMoney(12.344), 12.34);
});

test('calculateScenario returns expected net profit and margin for a typical digital product sale', () => {
  const result = calculateScenario({
    listPrice: 100,
    couponPercent: 10,
    vatPercent: 20,
    affiliatePercent: 30,
    productCost: 5,
    refundRate: 5,
    stripePercent: 2.9,
    stripeFixed: 0.3,
  });

  assert.deepEqual(result, {
    listPrice: 100,
    salePrice: 90,
    revenueExVat: 75,
    vatAmount: 15,
    stripeFee: 2.91,
    affiliateFee: 22.5,
    refundReserve: 3.75,
    productCost: 5,
    totalCosts: 34.16,
    netProfit: 40.84,
    profitMarginPercent: 54.45,
    breakEvenPrice: 11.49,
  });
});

test('calculateScenario supports a no-vat no-affiliate scenario', () => {
  const result = calculateScenario({
    listPrice: 50,
    couponPercent: 0,
    vatPercent: 0,
    affiliatePercent: 0,
    productCost: 10,
    refundRate: 0,
    stripePercent: 2.9,
    stripeFixed: 0.3,
  });

  assert.equal(result.salePrice, 50);
  assert.equal(result.revenueExVat, 50);
  assert.equal(result.stripeFee, 1.75);
  assert.equal(result.netProfit, 38.25);
  assert.equal(result.profitMarginPercent, 76.5);
  assert.equal(result.breakEvenPrice, 10.61);
});

test('calculateScenario rejects impossible percentages and non-positive prices', () => {
  assert.throws(() => calculateScenario({
    listPrice: 0,
    couponPercent: 0,
    vatPercent: 0,
    affiliatePercent: 0,
    productCost: 0,
    refundRate: 0,
    stripePercent: 2.9,
    stripeFixed: 0.3,
  }), /listPrice must be greater than 0/);

  assert.throws(() => calculateScenario({
    listPrice: 100,
    couponPercent: 101,
    vatPercent: 0,
    affiliatePercent: 0,
    productCost: 0,
    refundRate: 0,
    stripePercent: 2.9,
    stripeFixed: 0.3,
  }), /couponPercent must be between 0 and 100/);
});

const percentFields = [
  'couponPercent',
  'vatPercent',
  'affiliatePercent',
  'refundRate',
  'stripePercent',
];

function assertFiniteNumber(name, value) {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number`);
  }
}

function assertPercent(name, value) {
  assertFiniteNumber(name, value);
  if (value < 0 || value > 100) {
    throw new Error(`${name} must be between 0 and 100`);
  }
}

export function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateScenario(input) {
  assertFiniteNumber('listPrice', input.listPrice);
  if (input.listPrice <= 0) {
    throw new Error('listPrice must be greater than 0');
  }

  assertFiniteNumber('productCost', input.productCost);
  if (input.productCost < 0) {
    throw new Error('productCost must be greater than or equal to 0');
  }

  assertFiniteNumber('stripeFixed', input.stripeFixed);
  if (input.stripeFixed < 0) {
    throw new Error('stripeFixed must be greater than or equal to 0');
  }

  for (const field of percentFields) {
    assertPercent(field, input[field]);
  }

  const couponFactor = 1 - input.couponPercent / 100;
  const vatFactor = 1 + input.vatPercent / 100;
  const affiliateRate = input.affiliatePercent / 100;
  const refundRate = input.refundRate / 100;
  const stripeRate = input.stripePercent / 100;

  const salePrice = roundMoney(input.listPrice * couponFactor);
  const revenueExVat = roundMoney(salePrice / vatFactor);
  const vatAmount = roundMoney(salePrice - revenueExVat);
  const stripeFee = roundMoney(salePrice * stripeRate + input.stripeFixed);
  const affiliateFee = roundMoney(revenueExVat * affiliateRate);
  const refundReserve = roundMoney(revenueExVat * refundRate);
  const totalCosts = roundMoney(stripeFee + affiliateFee + refundReserve + input.productCost);
  const netProfit = roundMoney(revenueExVat - totalCosts);
  const profitMarginPercent = revenueExVat === 0 ? 0 : roundMoney((netProfit / revenueExVat) * 100);

  const breakEvenCoefficient = ((1 - affiliateRate - refundRate) / vatFactor) - stripeRate;
  const breakEvenSalePrice = breakEvenCoefficient <= 0
    ? Infinity
    : (input.productCost + input.stripeFixed) / breakEvenCoefficient;
  const breakEvenPrice = couponFactor <= 0 || !Number.isFinite(breakEvenSalePrice)
    ? Infinity
    : roundMoney(breakEvenSalePrice / couponFactor);

  return {
    listPrice: roundMoney(input.listPrice),
    salePrice,
    revenueExVat,
    vatAmount,
    stripeFee,
    affiliateFee,
    refundReserve,
    productCost: roundMoney(input.productCost),
    totalCosts,
    netProfit,
    profitMarginPercent,
    breakEvenPrice,
  };
}

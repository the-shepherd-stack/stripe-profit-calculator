const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatMoney(value) {
  return currencyFormatter.format(value);
}

function formatPercent(value) {
  return `${percentFormatter.format(value)}%`;
}

const deductionFields = [
  ['affiliateFee', 'Affiliate fee'],
  ['vatAmount', 'VAT collected'],
  ['productCost', 'Product cost'],
  ['refundReserve', 'Refund reserve'],
  ['stripeFee', 'Stripe fee'],
];

export function buildCostHighlights(result) {
  return deductionFields
    .map(([key, label]) => ({
      label,
      value: result[key],
    }))
    .filter(({ value }) => typeof value === 'number' && Number.isFinite(value) && value > 0)
    .sort((left, right) => right.value - left.value)
    .slice(0, 3)
    .map(({ label, value }) => `${label}: ${formatMoney(value)}`);
}

export function buildScenarioVerdict(result) {
  if (result.netProfit >= 0 && !Number.isFinite(result.breakEvenPrice)) {
    return {
      tone: 'positive',
      headline: `You keep ${formatMoney(result.netProfit)} from this sale.`,
      detail:
        'That means this setup is already at break-even, so there is no higher price floor to clear before you publish it.',
    };
  }

  if (result.netProfit >= 0) {
    return {
      tone: 'positive',
      headline: `You keep ${formatMoney(result.netProfit)} from this sale.`,
      detail: `That is a ${formatPercent(result.profitMarginPercent)} margin after Stripe fees, VAT, affiliates, refunds, and product cost. Your break-even list price is ${formatMoney(result.breakEvenPrice)}.`,
    };
  }

  if (!Number.isFinite(result.breakEvenPrice)) {
    return {
      tone: 'warning',
      headline: `This setup loses ${formatMoney(Math.abs(result.netProfit))} per sale.`,
      detail:
        'This mix of discounts and fees cannot reach break-even as entered. Lower the discount or fee load before you send traffic here.',
    };
  }

  return {
    tone: 'warning',
    headline: `This setup loses ${formatMoney(Math.abs(result.netProfit))} per sale.`,
    detail:
      `You need a list price of at least ${formatMoney(result.breakEvenPrice)} to break even, or you need to cut costs before selling this offer.`,
  };
}

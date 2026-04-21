export const scenarioFields = [
  'listPrice',
  'productCost',
  'couponPercent',
  'vatPercent',
  'affiliatePercent',
  'refundRate',
  'stripePercent',
  'stripeFixed',
];

export const presets = [
  {
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
  },
  {
    slug: 'cohort-course',
    label: 'Cohort course',
    summary: '$299 course sale with VAT and affiliate share',
    values: {
      listPrice: 299,
      productCost: 15,
      couponPercent: 20,
      vatPercent: 20,
      affiliatePercent: 30,
      refundRate: 5,
      stripePercent: 2.9,
      stripeFixed: 0.3,
    },
  },
  {
    slug: 'micro-saas',
    label: 'Micro-SaaS annual plan',
    summary: '$149 annual plan with no affiliate cut',
    values: {
      listPrice: 149,
      productCost: 8,
      couponPercent: 15,
      vatPercent: 0,
      affiliatePercent: 0,
      refundRate: 3,
      stripePercent: 2.9,
      stripeFixed: 0.3,
    },
  },
];

export function buildScenarioQuery(values) {
  const params = new URLSearchParams();

  for (const field of scenarioFields) {
    const value = values[field];
    if (typeof value === 'number' && Number.isFinite(value)) {
      params.set(field, String(value));
    }
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

export function parseScenarioQuery(queryString) {
  const params = new URLSearchParams(queryString.startsWith('?') ? queryString.slice(1) : queryString);
  const values = {};

  for (const field of scenarioFields) {
    if (!params.has(field)) {
      continue;
    }

    const value = Number(params.get(field));
    if (Number.isFinite(value)) {
      values[field] = value;
    }
  }

  return values;
}

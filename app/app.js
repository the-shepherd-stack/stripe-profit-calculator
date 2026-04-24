import { calculateScenario } from './calc.js';
import {
  buildScenarioQuery,
  parseScenarioQuery,
  presets,
  scenarioFields,
} from './scenarios.js';
import { buildCostHighlights, buildScenarioVerdict } from './verdict.js';

const form = document.querySelector('#calculator-form');
const resultsNode = document.querySelector('#results');
const presetGrid = document.querySelector('#preset-grid');
const shareUrlNode = document.querySelector('#share-url');
const copyShareButton = document.querySelector('#copy-share-link');
const copyStatusNode = document.querySelector('#copy-status');
const verdictHeadlineNode = document.querySelector('#verdict-headline');
const verdictDetailNode = document.querySelector('#verdict-detail');
const verdictSection = document.querySelector('.scenario-verdict');
const costHighlightsListNode = document.querySelector('#cost-highlights-list');
let pendingInputRun = null;

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const resultFields = [
  ['salePrice', 'Sale price after coupon'],
  ['revenueExVat', 'Revenue excluding VAT'],
  ['vatAmount', 'VAT collected'],
  ['stripeFee', 'Stripe fee'],
  ['affiliateFee', 'Affiliate fee'],
  ['refundReserve', 'Refund reserve'],
  ['productCost', 'Product cost'],
  ['totalCosts', 'Total costs'],
  ['netProfit', 'Net profit'],
  ['profitMarginPercent', 'Profit margin %', 'percent'],
  ['breakEvenPrice', 'Break-even list price'],
];

function readForm(formNode) {
  return Object.fromEntries(
    Array.from(new FormData(formNode), ([key, value]) => [key, Number(value)])
  );
}

function applyValuesToForm(values) {
  for (const field of scenarioFields) {
    if (typeof values[field] === 'number' && Number.isFinite(values[field]) && form.elements[field]) {
      form.elements[field].value = String(values[field]);
    }
  }
}

function formatValue(key, value, type) {
  if (key === 'breakEvenPrice' && !Number.isFinite(value)) {
    return 'Not reachable';
  }
  if (type === 'percent') {
    return `${percentFormatter.format(value)}%`;
  }
  return currencyFormatter.format(value);
}

function renderResult(result) {
  resultsNode.innerHTML = resultFields
    .map(([key, label, type]) => `<dt>${label}</dt><dd>${formatValue(key, result[key], type)}</dd>`)
    .join('');
}

function renderVerdict(result) {
  const verdict = buildScenarioVerdict(result);
  verdictSection.dataset.tone = verdict.tone;
  verdictHeadlineNode.textContent = verdict.headline;
  verdictDetailNode.textContent = verdict.detail;
}

function renderCostHighlights(result) {
  const highlights = buildCostHighlights(result);
  costHighlightsListNode.innerHTML = highlights
    .map((highlight) => `<li>${highlight}</li>`)
    .join('');
}

function buildShareUrl(values) {
  const url = new URL(window.location.href);
  url.search = buildScenarioQuery(values);
  url.hash = '';
  return url.toString();
}

function updateShareUrl(values) {
  const shareUrl = buildShareUrl(values);
  shareUrlNode.value = shareUrl;
  window.history.replaceState({}, '', shareUrl);
}

function clearCopyStatus() {
  copyStatusNode.textContent = '';
}

function setCopyStatus(message) {
  copyStatusNode.textContent = message;
}

function runCalculation() {
  const values = readForm(form);
  const result = calculateScenario(values);
  renderVerdict(result);
  renderCostHighlights(result);
  renderResult(result);
  updateShareUrl(values);
  clearCopyStatus();
}

function renderPresets() {
  presetGrid.innerHTML = presets
    .map((preset) => `
      <article class="preset-card">
        <h3>${preset.label}</h3>
        <p>${preset.summary}</p>
        <button type="button" class="preset-button" data-preset="${preset.slug}">Load scenario</button>
      </article>
    `)
    .join('');

  presetGrid.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = presets.find((entry) => entry.slug === button.dataset.preset);
      if (!preset) {
        return;
      }
      applyValuesToForm(preset.values);
      runCalculation();
    });
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  runCalculation();
});

form.addEventListener('input', (event) => {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  window.clearTimeout(pendingInputRun);
  pendingInputRun = window.setTimeout(() => {
    try {
      runCalculation();
    } catch (error) {
      // Ignore temporary invalid states while a visitor is editing a number field.
    }
  }, 150);
});

copyShareButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(shareUrlNode.value);
    setCopyStatus('Share link copied.');
  } catch {
    shareUrlNode.focus();
    shareUrlNode.select();
    setCopyStatus('Copy failed automatically. Selected the share link for manual copy.');
  }
});

renderPresets();
applyValuesToForm(parseScenarioQuery(window.location.search));
runCalculation();

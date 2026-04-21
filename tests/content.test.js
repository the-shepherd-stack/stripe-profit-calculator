import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const homepagePath = resolve(projectRoot, 'index.html');
const notionArticlePath = resolve(projectRoot, 'stripe-fees-for-notion-templates', 'index.html');

function readText(path) {
  return readFileSync(path, 'utf8');
}

test('homepage links to the Notion template support article for internal distribution', () => {
  const homepage = readText(homepagePath);

  assert.match(
    homepage,
    /href="\.\/stripe-fees-for-notion-templates\/"[^>]*>Notion template pricing guide</,
  );
});

test('Notion template support article includes the live preset link and homepage CTA', () => {
  const article = readText(notionArticlePath);

  assert.match(article, /<title>Stripe Fees for Notion Templates \| Stripe Profit Calculator</);
  assert.match(article, /stripe fees for notion templates/i);
  assert.match(
    article,
    /https:\/\/stripe-profit-calculator\.vercel\.app\/\?listPrice=49&productCost=0&couponPercent=10&vatPercent=0&affiliatePercent=0&refundRate=2&stripePercent=2\.9&stripeFixed=0\.3/,
  );
  assert.match(article, />Stripe fee calculator for digital products</);
});

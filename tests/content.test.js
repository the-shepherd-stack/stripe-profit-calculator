import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const homepagePath = resolve(projectRoot, 'index.html');
const notionArticlePath = resolve(projectRoot, 'stripe-fees-for-notion-templates', 'index.html');
const courseArticlePath = resolve(projectRoot, 'stripe-fees-for-online-courses', 'index.html');
const microSaasArticlePath = resolve(projectRoot, 'stripe-fees-for-micro-saas', 'index.html');
const digitalPricingArticlePath = resolve(projectRoot, 'digital-product-pricing-calculator', 'index.html');
const faviconPath = resolve(projectRoot, 'favicon.svg');
const socialCardPath = resolve(projectRoot, 'social-preview.png');
const robotsPath = resolve(projectRoot, 'robots.txt');
const sitemapPath = resolve(projectRoot, 'sitemap.xml');
const indexNowKeyPath = resolve(projectRoot, '26125b8d-03bc-4033-9664-c567f18ad9a4.txt');

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

test('homepage links to the online courses support article for internal distribution', () => {
  const homepage = readText(homepagePath);

  assert.match(
    homepage,
    /href="\.\/stripe-fees-for-online-courses\/"[^>]*>Online course pricing guide</,
  );
});

test('homepage links to the micro-SaaS support article for internal distribution', () => {
  const homepage = readText(homepagePath);

  assert.match(
    homepage,
    /href="\.\/stripe-fees-for-micro-saas\/"[^>]*>Micro-SaaS pricing guide</,
  );
});

test('homepage keeps the CTA copy customer-facing', () => {
  const homepage = readText(homepagePath);

  assert.match(homepage, />See common pricing questions</);
  assert.doesNotMatch(homepage, />See target search questions</);
  assert.doesNotMatch(homepage, /Search-first utility/);
});

test('homepage highlights zero-friction value above the fold', () => {
  const homepage = readText(homepagePath);

  assert.match(homepage, /No signup required/i);
  assert.match(homepage, /Profit and break-even instantly/i);
  assert.match(homepage, /Share pricing scenarios with a link/i);
});

test('homepage includes a share-ready social preview for distribution posts', () => {
  const homepage = readText(homepagePath);

  assert.match(homepage, /<link rel="canonical" href="https:\/\/profitafterfees\.com\/?" \/>/);
  assert.match(homepage, /<meta property="og:url" content="https:\/\/profitafterfees\.com\/?" \/>/);
  assert.match(homepage, /<meta property="og:image" content="https:\/\/profitafterfees\.com\/social-preview\.png" \/>/);
  assert.match(homepage, /<meta property="og:image:width" content="1200" \/>/);
  assert.match(homepage, /<meta property="og:image:height" content="630" \/>/);
  assert.match(homepage, /<meta\s+property="og:image:alt"\s+content="Stripe profit calculator preview showing fees, profit, and break-even pricing for digital products\."\s+\/>/);
  assert.match(homepage, /<meta name="twitter:card" content="summary_large_image" \/>/);
  assert.match(homepage, /<meta name="twitter:title" content="Your Stripe margin math is wrong" \/>/);
  assert.match(homepage, /<meta\s+name="twitter:description"\s+content="See your real net profit and break-even after VAT, coupons, affiliates, refunds, Stripe fees, and delivery costs\."\s+\/>/);
  assert.match(homepage, /<meta name="twitter:image" content="https:\/\/profitafterfees\.com\/social-preview\.png" \/>/);
});

test('social preview image exists for homepage shares', () => {
  assert.equal(existsSync(socialCardPath), true);
});

test('Notion template support article includes the live preset link and homepage CTA', () => {
  const article = readText(notionArticlePath);

  assert.match(article, /<title>Stripe Fees for Notion Templates \| Profit After Fees</);
  assert.match(article, /stripe fees for notion templates/i);
  assert.match(
    article,
    /https:\/\/profitafterfees\.com\/\?listPrice=49&productCost=0&couponPercent=10&vatPercent=0&affiliatePercent=0&refundRate=2&stripePercent=2\.9&stripeFixed=0\.3/,
  );
  assert.match(article, />Stripe fee calculator for digital products</);
});

test('online courses support article includes the live preset link and homepage CTA', () => {
  const article = readText(courseArticlePath);

  assert.match(article, /<title>Stripe Fees for Online Courses \| Profit After Fees</);
  assert.match(article, /stripe fees for online courses/i);
  assert.match(
    article,
    /https:\/\/profitafterfees\.com\/\?listPrice=299&productCost=15&couponPercent=20&vatPercent=20&affiliatePercent=30&refundRate=5&stripePercent=2\.9&stripeFixed=0\.3/,
  );
  assert.match(article, />Stripe fee calculator for digital products</);
});

test('micro-SaaS support article includes the live preset link and homepage CTA', () => {
  const article = readText(microSaasArticlePath);

  assert.match(article, /<title>Stripe Fees for Micro-SaaS \| Profit After Fees</);
  assert.match(article, /stripe fees for micro-saas/i);
  assert.match(
    article,
    /https:\/\/profitafterfees\.com\/\?listPrice=149&productCost=8&couponPercent=15&vatPercent=0&affiliatePercent=0&refundRate=3&stripePercent=2\.9&stripeFixed=0\.3/,
  );
  assert.match(article, />Stripe fee calculator for digital products</);
});

test('support articles avoid internal SEO-style phrasing', () => {
  const notionArticle = readText(notionArticlePath);
  const courseArticle = readText(courseArticlePath);
  const microSaasArticle = readText(microSaasArticlePath);

  assert.doesNotMatch(notionArticle, /Searchers asking about/i);
  assert.doesNotMatch(courseArticle, /Searchers asking about/i);
  assert.doesNotMatch(microSaasArticle, /Searchers asking about/i);
});

test('robots.txt advertises the sitemap for external crawlers', () => {
  const robots = readText(robotsPath);

  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/profitafterfees\.com\/sitemap\.xml$/m);
});

test('sitemap.xml lists the live homepage and support pages for external discovery', () => {
  const sitemap = readText(sitemapPath);

  assert.match(sitemap, /<loc>https:\/\/profitafterfees\.com\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/profitafterfees\.com\/stripe-fees-for-notion-templates\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/profitafterfees\.com\/stripe-fees-for-online-courses\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/profitafterfees\.com\/stripe-fees-for-micro-saas\/<\/loc>/);
});

test('IndexNow key file exists for external URL submission', () => {
  const key = readText(indexNowKeyPath).trim();

  assert.equal(key, '26125b8d-03bc-4033-9664-c567f18ad9a4');
});


test('homepage upgrades metadata toward a sharper share preview and includes a favicon', () => {
  const homepage = readText(homepagePath);

  assert.match(homepage, /<title>Stripe Fee Calculator for Digital Products \| Profit After Fees<\/title>/);
  assert.match(homepage, /<link rel="icon" href="\.\/favicon\.svg" type="image\/svg\+xml" \/>/);
  assert.match(homepage, /<meta property="og:title" content="Your Stripe margin math is wrong" \/>/);
  assert.match(homepage, /<meta name="twitter:title" content="Your Stripe margin math is wrong" \/>/);
  assert.match(homepage, /<meta\s+property="og:description"\s+content="See your real net profit and break-even after VAT, coupons, affiliates, refunds, Stripe fees, and delivery costs\."\s+\/>/);
  assert.match(homepage, /<meta\s+name="twitter:description"\s+content="See your real net profit and break-even after VAT, coupons, affiliates, refunds, Stripe fees, and delivery costs\."\s+\/>/);
});

test('favicon asset exists for browser tabs and shared links', () => {
  assert.equal(existsSync(faviconPath), true);
});

test('homepage links to the digital product pricing calculator page for broader search intent', () => {
  const homepage = readText(homepagePath);

  assert.match(homepage, /href="\.\/digital-product-pricing-calculator\/"[^>]*>Digital product pricing calculator</);
});

test('digital product pricing calculator page exists with customer-facing copy and calculator CTA', () => {
  const article = readText(digitalPricingArticlePath);

  assert.match(article, /<title>Digital Product Pricing Calculator \| Profit After Fees</);
  assert.match(article, /<h1>Digital product pricing calculator for real net profit and break-even<\/h1>/);
  assert.match(article, /digital product pricing calculator/i);
  assert.match(article, /your margin math is wrong/i);
  assert.match(article, /https:\/\/profitafterfees\.com\/\?listPrice=100&productCost=5&couponPercent=10&vatPercent=20&affiliatePercent=30&refundRate=5&stripePercent=2\.9&stripeFixed=0\.3/);
  assert.match(article, />Open the calculator with a realistic digital product scenario</);
});

test('sitemap.xml includes the digital product pricing calculator page', () => {
  const sitemap = readText(sitemapPath);

  assert.match(sitemap, /<loc>https:\/\/profitafterfees\.com\/digital-product-pricing-calculator\/<\/loc>/);
});
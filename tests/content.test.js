import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const homepagePath = resolve(projectRoot, 'index.html');
const notionArticlePath = resolve(projectRoot, 'stripe-fees-for-notion-templates', 'index.html');
const courseArticlePath = resolve(projectRoot, 'stripe-fees-for-online-courses', 'index.html');
const microSaasArticlePath = resolve(projectRoot, 'stripe-fees-for-micro-saas', 'index.html');
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

test('online courses support article includes the live preset link and homepage CTA', () => {
  const article = readText(courseArticlePath);

  assert.match(article, /<title>Stripe Fees for Online Courses \| Stripe Profit Calculator</);
  assert.match(article, /stripe fees for online courses/i);
  assert.match(
    article,
    /https:\/\/stripe-profit-calculator\.vercel\.app\/\?listPrice=299&productCost=15&couponPercent=20&vatPercent=20&affiliatePercent=30&refundRate=5&stripePercent=2\.9&stripeFixed=0\.3/,
  );
  assert.match(article, />Stripe fee calculator for digital products</);
});

test('micro-SaaS support article includes the live preset link and homepage CTA', () => {
  const article = readText(microSaasArticlePath);

  assert.match(article, /<title>Stripe Fees for Micro-SaaS \| Stripe Profit Calculator</);
  assert.match(article, /stripe fees for micro-saas/i);
  assert.match(
    article,
    /https:\/\/stripe-profit-calculator\.vercel\.app\/\?listPrice=149&productCost=8&couponPercent=15&vatPercent=0&affiliatePercent=0&refundRate=3&stripePercent=2\.9&stripeFixed=0\.3/,
  );
  assert.match(article, />Stripe fee calculator for digital products</);
});

test('robots.txt advertises the sitemap for external crawlers', () => {
  const robots = readText(robotsPath);

  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/stripe-profit-calculator\.vercel\.app\/sitemap\.xml$/m);
});

test('sitemap.xml lists the live homepage and support pages for external discovery', () => {
  const sitemap = readText(sitemapPath);

  assert.match(sitemap, /<loc>https:\/\/stripe-profit-calculator\.vercel\.app\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/stripe-profit-calculator\.vercel\.app\/stripe-fees-for-notion-templates\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/stripe-profit-calculator\.vercel\.app\/stripe-fees-for-online-courses\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/stripe-profit-calculator\.vercel\.app\/stripe-fees-for-micro-saas\/<\/loc>/);
});

test('IndexNow key file exists for external URL submission', () => {
  const key = readText(indexNowKeyPath).trim();

  assert.equal(key, '26125b8d-03bc-4033-9664-c567f18ad9a4');
});

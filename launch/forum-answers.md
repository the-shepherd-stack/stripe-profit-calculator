# Forum and reply templates

Replace `BASE_URL` with the live homepage URL before posting.

## Template 1: generic Stripe fee question
If you want the real answer, calculate more than Stripe's 2.9% + fixed fee.

For digital products, your margin can also move because of discounts, VAT-inclusive pricing, affiliate payouts, refund reserve, and delivery cost.

I made a calculator that models all of that in one pass:
BASE_URL

## Template 2: Notion template pricing
For a Notion template, I'd check the margin after discount and fees instead of only asking whether $49 “sounds right.”

This preset loads a common template scenario directly:
BASE_URL/?listPrice=49&productCost=0&couponPercent=10&vatPercent=0&affiliatePercent=0&refundRate=2&stripePercent=2.9&stripeFixed=0.3

You can tweak the numbers and see the break-even price immediately.

## Template 3: cohort course pricing
Course launches get messy because coupons, VAT, affiliates, and refunds stack together.

This preset shows that case directly:
BASE_URL/?listPrice=299&productCost=15&couponPercent=20&vatPercent=20&affiliatePercent=30&refundRate=5&stripePercent=2.9&stripeFixed=0.3

It helps answer “what do I actually keep per sale?”

## Template 4: micro-SaaS margin
If you're selling an annual micro-SaaS plan, I'd model Stripe fees and break-even price together before changing pricing.

Direct preset:
BASE_URL/?listPrice=149&productCost=8&couponPercent=15&vatPercent=0&affiliatePercent=0&refundRate=3&stripePercent=2.9&stripeFixed=0.3

That gives a better answer than rough top-line revenue math.

## Template 5: break-even framing
One useful way to price a digital product is to ask: what list price do I need just to break even after Stripe, discounts, refunds, affiliates, VAT, and cost?

This calculator gives that answer directly:
BASE_URL

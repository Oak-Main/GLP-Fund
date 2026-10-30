---
status: resolved
title: Stale copy that still describes a confirmed figure as reported, unreachable or unverified
date: 2026-10-29
resolved: 2026-10-29
---

Found by the 2026-10-29 verification pass and resolved in the M2d pass. Each
sentence below was checked against the frozen medicare.gov fixture
(`test/fixtures/sources/2026-10-29/medicare.gov-coverage-weight-loss-drugs.txt`)
before it was applied, and any clause the fixture does not support was deleted
rather than kept as "reported".

## 1. The Medicare Bridge pathway description — DONE, 698b4c8

**File:** `public/data/pricing.json`, `pathways.medicare_bridge.description`
**Renders on:** the home page, as the pathway summary; and the Medicare GLP-1
Bridge page.

Was:

> A Medicare access pathway reported to provide a fixed monthly beneficiary cost
> for a covered GLP-1, subject to clinical eligibility criteria.

Now:

> A Medicare program that sets a fixed monthly copayment for a covered GLP-1
> medicine, for beneficiaries who meet its clinical criteria.

Every clause is in the fixture: the Medicare GLP-1 Bridge program, the $50 monthly
copayment, the covered GLP-1 drugs, and the eligibility requirements.

## 2. The Part D exclusion rule — DONE, 698b4c8

**File:** `public/data/pricing.json`,
`eligibilityRules[id=medicare-bridge-part-d-eligible-exclusion].reason`
**Renders on:** every drug page's eligibility notes, and the Medicare GLP-1
Bridge page.

Now:

> Medicare states that you are not eligible for this program if you already get
> GLP-1 drugs covered through your Medicare Part D plan, or if you have type 2
> diabetes, moderate-to-severe sleep apnea, or fatty liver disease. Your Part D
> plan might cover your GLP-1 instead. Confirm your own position with Medicare.

The rule now uses medicare.gov's term "fatty liver disease", not "noncirrhotic
MASH". The same wording changed in the comment above `partDGlp1Eligible` in
`public/engine/eligibility.js`, with no logic change. The change is logged in the
changelog, as runbook section 1.4 requires.

## 3. The Medicare Bridge FAQ — DONE, 698b4c8

**File:** `tools/build-pages.mjs`, `FAQS['medicare-glp1-bridge']`, first answer.

Now:

> Medicare states that the program gives eligible beneficiaries a fixed monthly
> copayment for a covered GLP-1, with a BMI threshold and a further route in at
> a lower BMI. You are not eligible if you already get GLP-1 drugs covered
> through your Part D plan, or if you have type 2 diabetes, moderate-to-severe
> sleep apnea, or fatty liver disease. Confirm your own eligibility with Medicare
> directly.

One clause from the draft was deleted before it was applied: "when a
weight-related condition is present". The fixture states the conditions
specifically, by name, and does not use the phrase "weight-related".

## 4. The guard — DONE, d67e3fb

The word "reported" must not appear anywhere on the built
`/medicare-glp1-bridge/` page, including inside its FAQPage JSON-LD, because
that is what a search engine may quote. The test has a planted-string negative
control.

Two things were needed to make the page clean. The page's own meta description
and Open Graph description said "eligibility and cost as reported", and the
BALANCE eligibility note, which renders on every page including this one, opened
with "A federal program reported for 2026". The BALANCE rule itself is
unchanged: it stays a note rule, it keeps its path, and it still says that
participation is voluntary and that what you pay depends on your own state. Only
the word "reported" was taken out of it, because the page it renders on may not
carry it. The honest uses of "reported" elsewhere, on pages whose figure is
genuinely not confirmed, are untouched.

## Related, and not about a confirmed figure

Listed for completeness rather than because it is wrong.

- `public/data/pricing.json`,
  `eligibilityRules[id=medicaid-balance-model-is-state-variable].reason`: "A
  federal program for 2026 negotiates terms on behalf of state Medicaid
  agencies, but participation is voluntary and what you pay depends on your own
  state." The BALANCE participating-state list was not located, so the
  uncertainty is real. The rule is unchanged.
- `public/data/pricing.json`,
  `prices[drug=foundayo, dose_or_tier=top_doses, pathway=lillydirect_self_pay]`,
  caveat: the Foundayo LillyDirect terms were read on 2026-10-29 in commit
  8041e20, and the 45-day refill condition and the regular prices are now
  stated from the manufacturer rather than reported. The row is published, not a
  gap.
- `public/data/pricing.json`,
  `prices[drug=ozempic, dose_or_tier=any, pathway=novocare_self_pay]`, and the
  other Ozempic and Wegovy rows: Novo Nordisk's own price guide was read on
  2026-10-29. It publishes the self-pay and savings prices and no list price,
  which is why the Ozempic list price stays conflicting. That is the M2d decision
  to leave as it is, and it does not block the merge.

## Already corrected in this pass, for the record

- The methodology banner said "We currently publish no verified prices at all"
  and that the network refused every primary source. It now states the
  confirmed count, computed from the data.
- The TrumpRx pathway page said the platform could not be read and that its
  figures were curated by hand. It now says the platform is read directly.
- The LillyDirect pathway page said the refill condition had not been confirmed
  against Eli Lilly. It now states the condition as the manufacturer states it.
- The Medicare GLP-1 Bridge page's intro and its two sections were replaced
  with the approved copy.
- Every caveat figure is now written as a figure, not in words, and every such
  figure is proved against the page the row was read from.
- The Mounjaro self-pay figure is a starting price, and every visible
  rendering of it says "From $499".

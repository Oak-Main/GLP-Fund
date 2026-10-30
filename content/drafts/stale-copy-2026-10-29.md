---
status: needs-human-review
title: Stale copy that still describes a confirmed figure as reported, unreachable or unverified
date: 2026-10-29
---

Found by the 2026-10-29 verification pass. These sentences are **listed, not
edited**: each one still tells a reader that a figure we have confirmed against a
primary source is only reported, unreachable or unverified. They need the
owner's hand, because each one is page copy and the fix is a judgment about how
much to claim.

The sentences are in `public/data/pricing.json`, which is where the copy for
these elements lives.

## 1. The Medicare Bridge pathway description

**File:** `public/data/pricing.json`, `pathways.medicare_bridge.description`
**Renders on:** the home page, as the pathway summary; and the Medicare GLP-1
Bridge page.

> A Medicare access pathway reported to provide a fixed monthly beneficiary cost
> for a covered GLP-1, subject to clinical eligibility criteria.

**Why it is stale.** medicare.gov was read directly on 2026-10-29. The programme,
its beneficiary cost, its covered medicines and its exclusions are confirmed, and
the figure is published as a confirmed price. The page's own intro and body were
replaced with the approved copy; this description was not, because it is a field
in the data file rather than in the page template.

## 2. The Part D exclusion rule

**File:** `public/data/pricing.json`,
`eligibilityRules[id=medicare-bridge-part-d-eligible-exclusion].reason`
**Renders on:** every drug page's eligibility notes, and the Medicare GLP-1
Bridge page.

> This program is reported to be for beneficiaries who cannot already get a
> GLP-1 through their Part D plan. A diagnosis of type 2 diabetes, moderate to
> severe obstructive sleep apnea, or noncirrhotic MASH is reported to confer
> Part D GLP-1 eligibility and therefore to disqualify you from this program,
> even if you meet every clinical criterion.

**Why it is stale.** The rule now carries a verbatim quote from medicare.gov and
no longer claims to be pending verification, but its reason still says the
exclusion "is reported". The exclusion is confirmed: the page states that you
are not eligible if you already get GLP-1 drugs covered through your Medicare
Part D plan, and that type 2 diabetes, moderate-to-severe sleep apnea or fatty
liver disease disqualifies you.

**A detail worth the owner's attention while rewriting this one.** The
manufacturer's wording and the rule's wording do not match exactly. medicare.gov
says "fatty liver disease"; the rule says "noncirrhotic MASH". The overlap is
large but not identical, and the rule is the more specific claim of the two.
The runbook's section 1.4 says a rule that contradicts the source must be
changed or deleted, and logged in the changelog. The exclusion itself is
confirmed; only the wording needs a decision.

## 3. The Medicare Bridge FAQ, and one sentence I did change

**File:** `tools/build-pages.mjs`, `FAQS['medicare-glp1-bridge']`

Two answers, both visible on the page and both repeated in its FAQPage
structured data.

**Changed, because the guard forbids the phrase.** The second answer read:

> No. We could not reach CMS to confirm the beneficiary cost, so it renders as
> unverified rather than as a number. The exclusions we apply anyway, because
> applying them is the cautious direction.

It sat on the same page as a confirmed fifty dollar copayment, and it is the
one sentence in this pass that carried a phrase the new guard forbids in the
built output. It now reads:

> Yes. The cost is a fixed monthly copayment, shown below with the date we read
> it.

The replacement reuses the approved copy's own sentence. It is flagged here
because it is a change to page copy that was not in the approved list, and it
should be rewritten in the owner's words.

**Left for the owner, because the guard does not reach it.** The first answer
still reads:

> The program is reported to provide a fixed low monthly cost to eligible
> Medicare beneficiaries, subject to a BMI threshold, with a further route in at
> a lower BMI where a weight-related comorbid condition is present. It is
> reported to exclude beneficiaries whose therapy is already covered under the
> obstructive sleep apnea indication. Confirm your own eligibility with
> Medicare directly.

Its facts are confirmed and its framing is not. It is the one place on the site
that still says "reported" about a figure the site publishes as confirmed, so
the page currently reads "Medicare states" in the body and "reported" in the
FAQ. One edit settles it. The exclusion it names is worth checking while it is
being rewritten: the rule says "type 2 diabetes, moderate to severe obstructive
sleep apnea, or noncirrhotic MASH", and medicare.gov says "type 2 diabetes,
moderate-to-severe sleep apnea, or fatty liver disease".

## Related, and not about a confirmed figure

Listed for completeness rather than because it is wrong.

- `public/data/pricing.json`,
  `eligibilityRules[id=medicaid-balance-model-is-state-variable].reason`: "A
  federal program reported for 2026 negotiates terms on behalf of state Medicaid
  agencies, but participation is voluntary and what you pay depends on your own
  state." The BALANCE participating-state list was not located, so "reported" is
  honest here.
- `public/data/pricing.json`,
  `prices[drug=foundayo, dose_or_tier=top_doses, pathway=lillydirect_self_pay]`,
  caveat: "At the two highest doses a lower price is reported to require
  refilling within 45 days of your previous fill being delivered. Miss that
  window and the price is reported to revert to the higher regular figure. If
  you are on 14.5 mg or 17.2 mg, ask the programme what happens if a refill is
  late before you rely on any figure here." The Foundayo LillyDirect terms have
  not been read, so this is honest for that pathway. The 45-day condition is
  confirmed for Zepbound, and for Foundayo on the federal platform.

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

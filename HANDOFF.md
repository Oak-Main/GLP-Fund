# Handoff: verification pass 2026-10-29

## Counts

| State | Before | After |
| --- | --- | --- |
| Confirmed | 8 | 21 |
| Conflicting | 3 | 2 |
| Unverified | 34 | 24 |
| Total figures | 45 | 47 |

The figure count rose because the TrumpRx Zepbound price is now filed per
strength instead of once under the tier name "any". That is the correction
described below, and it is the reason a visitor who selected 15 mg was being
shown the 2.5 mg headline.

`verification.status` is `partially_verified`, with the true counts in
`verification.summary`.

## The blocker that was found, and what was done about it

A visitor selecting **Zepbound 15 mg** was shown the **$299** TrumpRx headline.
The price was filed under the tier name "any", which is how a flat-priced drug
is filed, and the engine falls back to it. $299 is the 2.5 mg price. The browser
test selected 15 mg and asserted $299, so the suite was not merely tolerating
the defect, it was asserting it.

The price is now filed per strength, under the tier names the drug already
declares:

| Tier | TrumpRx | LillyDirect | Condition |
| --- | --- | --- | --- |
| 2.5 mg | 299 | 299 | regular price, no condition |
| 5 mg | 399 | 399 | regular price, no condition |
| 7.5 mg, 10 mg, 12.5 mg, 15 mg | 449 | 449 | the purchase offer, conditional on a refill within 45 days |

A new test asserts all six Zepbound doses against both pathways, and a second
assertion fails if a flat Zepbound TrumpRx row under "any" ever comes back. The
browser harness now asserts $449 at 15 mg, $299 at 2.5 mg, and the 45-day
condition on the LillyDirect card.

## The rationale that was withdrawn

The first pass in this lane recorded that the Zepbound introductory-pricing
caveat had been "refuted" because the TrumpRx page carries no introductory
warning. That was wrong and it is withdrawn. The Zepbound offer is not an
introductory offer. The manufacturer's own terms state a purchase offer that
continues only while the refill purchase is completed within 45 days of the
delivery or receipt date of the previous prescription, with the regular price
stated as $499 at 7.5 mg and $699 at 10 mg, 12.5 mg and 15 mg once that window
is missed. The earlier pass had not read those terms; it had read a secondary
summary of them, and the absence of a warning on one platform says nothing
about the terms on another.

The rows now carry the precise restriction, and the verbatim source is frozen
at `test/fixtures/sources/2026-10-29/lilly.com-lillydirect-zepbound-self-pay-terms-conditions.txt`.

## Done

**The runbook's verification pass was run end to end.** Twenty-seven pages were
read directly and frozen as fixtures with a SHA-256 line at the top each.

- Every host in `docs/ops-runbook.md` section 1.1 probed, at most two retries
  each. The log is in `docs/verification-2026-10-29.md`.
- 13 rows promoted to confirmed: six Zepbound rows (three per pathway), the
  Medicare Bridge copayment for four medications, the Wegovy standard-dose
  TrumpRx price, the Foundayo TrumpRx price, and the Foundayo and Mounjaro list
  prices.
- 8 rows re-confirmed. The date moved to 2026-10-29 on every one of them,
  because re-confirming is a verification event.
- 4 of the 5 pending eligibility rules retired against verbatim quotes: two from
  medicare.gov and two from the manufacturer's own savings card terms. The
  `verificationDebt` assertion now pins the one remaining pending rule id.
- 14 rules and rows whose sources were re-read have their candidate blocks
  updated with what was found and what was not.
- One changelog entry for the pass, 41 changes in the runbook's format, 27
  sources. The regenerated `public/` tree is committed with it.

## Not done, and why

**The Lilly pages refused an automated read and were read in a browser instead.**
Six of them were read that way, which is the method the runbook has always
prescribed for these hosts. What remains unread is listed in `OWNER_STEPS.md`:
the Foundayo LillyDirect pricing, the Lilly Cares income threshold, and the
Mounjaro per-strength self-pay price.

**One hard rule is still pending.** `patient-assistance-income-tier` needs the
income threshold, which is not published on the Lilly Cares pages that were
read. The 2026 federal poverty guidelines are held directly, so the
denominator is done and only the percentage is missing.

**Mounjaro self-pay is not published.** The page shows "Starting at $499/month"
at every strength with no per-strength table. Under the house rule a bound is
not a price, so the row stays null and the read is recorded.

**The Zepbound list price is not published.** Lilly's price-disclosure page
states it as a range, $499 to $1,086.37 per fill, and does not say which dose
each end belongs to. That supersedes the four circulating figures previously
recorded against the row, but a range is still not a price.

**The Ozempic list price is still conflicting.** It needs a Novo Nordisk list
price, which was not read.

**novonordiskpap.com was not probed.** It is outside the egress allowlist in
the runbook. The three patient-assistance rows that cite it say so.

**One gate was not doing its job.** The allowlist gate filtered the deployed
tree with `relative(ROOT, f).startsWith('public/')`, which is false for every
file on Windows because `relative()` emits backslashes. The gate collected zero
files and passed vacuously while CI, on Linux, caught a real non-allowlisted
host it had never looked at. The path check is repaired, the gate now asserts
that it is looking at a non-empty tree, and a negative control test plants a
non-allowlisted link and asserts that it is caught. The repaired gate then
immediately caught a real violation in the changelog, which is how the
`www.accessdata.fda.gov` allowlist entry was found.

**The methodology banner and the TrumpRx pathway page were stale.** They said no
verified prices were published and that the platform could not be read. Both
are repaired, with the counts computed from the data rather than typed.

## How to run it

```
git clone https://github.com/Oak-Main/GLP-Fund.git
cd GLP-Fund
git checkout mm/glp-verify-1028
npm test
node tools/build-pages.mjs
git diff --exit-code public/     # must be clean
node tools/qa.mjs
node tools/contrast-audit.mjs
node tools/keyboard-audit.mjs
```

The browser gates need a Chromium binary. On Windows:

```
$env:CHROMIUM_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
```

Without it the three browser gates exit non-zero with "No Chromium found", which
is an environment problem and not a result about the site.

## The two branches

| Branch | Pull request | What it is |
| --- | --- | --- |
| `mm/glp-verify-1028` | #17, draft, base `main` | the verification pass |
| `mm/glp-jan1-2027` | #18, draft, base `mm/glp-verify-1028` | the year-end prices, for 2027-01-01 |

Neither is merged. Neither should be merged without the owner.

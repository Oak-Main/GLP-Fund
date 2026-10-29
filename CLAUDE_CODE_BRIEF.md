# Finalization brief

For whoever picks this up next. The verification pass of 2026-10-28 is complete and
committed. What follows is what has to happen to finish it, in priority order.

## 1. Read the two draft pull requests before anything else

- PR #17, `mm/glp-verify-1028` into `main`. The verification pass. Six figures
  published, two rules retired, 14 rows re-confirmed.
- PR #18, `mm/glp-jan1-2027` into `mm/glp-verify-1028`. The year-end prices, for
  2027-01-01.

Both list every piece of prose this lane was permitted to write, so the review is a
read of a list rather than a hunt through a diff.

## 2. Read the browser, page by page

`OWNER_STEPS.md` lists the six refused Eli Lilly pages with the exact figures and
condition sentences needed from each. In priority order, because each one retires
pending rules or publishes a family of prices:

1. `lillydirect.lilly.com` -- the largest single unlock. Thirteen rows across Zepbound
   vials, the Zepbound list figure, the Zepbound savings card, Mounjaro and Foundayo,
   plus the refill-window condition that the current caveats describe only in
   second-hand words.
2. `zepbound.lilly.com` -- the list or WAC figure with its as-of date, the savings
   card copay for a covered and a non-covered indication separately, and the verbatim
   federal-programme exclusion sentence. This read retires
   `copay-card-federal-program-bar`.
3. `www.lillycares.com` -- the income thresholds, and whether Zepbound is covered.
   This read retires `patient-assistance-income-tier`.
4. `pricinginfo.lilly.com` -- the Foundayo list price. If the same host publishes a
   Zepbound list figure, it may resolve the four-way conflict on
   `zepbound|any|list_price`.
5. `www.lilly.com` -- the LillyDirect full terms and conditions for Foundayo, which
   is the document that states what happens to the temporary 2026 reduction on
   2027-01-01.
6. `mounjaro.lilly.com` -- the Mounjaro self-pay price, if it is not already covered
   by the LillyDirect read.

Paste each back headed `OWNER BROWSER READ`, with the URL, the read date, the figure
and the verbatim condition sentence. It is treated as a primary read: promoted with
`source_type: primary_manufacturer`, provenance "owner browser read <date>", and the
pasted text saved as a frozen fixture.

## 3. Owner decisions that are open

1. **The introductory-pricing caveat was removed from the Zepbound TrumpRx card.**
   The prior pass carried it and said it could neither confirm nor refute it; the
   direct read refutes it. The zepbound-cost page no longer shows the
   introductory-pricing warning block. This is the one change in this pass that
   removes a warning from a page, so it wants an explicit yes or no.
2. **Should a list price be published from a federal platform's reference price?**
   The platform shows an "Original Price" beside every offer but does not call it a
   list price. The two list-price rows for Ozempic and Zepbound stay conflicting
   because of it.
3. **Should the Ozempic tablet get its own drug, page and rows?** It is priced on the
   same manufacturer page and on the federal platform, and the dataset has no
   `ozempic_pill` drug at all.
4. **Should novonordiskpap.com be added to the egress allowlist?** Three patient
   assistance rows for Ozempic and Wegovy depend on it.
5. **The methodology banner still says no verified prices are published.** It is
   stale. Rewriting it is page copy, which the lane was not allowed to touch.
6. **Should the date on the fixtures and the data be 2026-10-28 or 2026-10-29?** The
   lane specifies 2026-10-28 throughout, and the data carries that. The reads
   actually crossed the UTC midnight boundary and the fixture headers carry the true
   2026-10-29 UTC times.

## 4. Before 2027-01-01

- Do not merge PR #18 before 2027-01-01. The prices on it do not apply before then.
- On 2027-01-01, run the January re-verification first: walk section 1.1 end to end
  and move every `verified_date` you re-read. Everything on the site was read on
  2026-10-28, so by 2027-01-01 the whole site is 65 days old and the staleness
  failsafe will be shouting "urgent" on every card.
- Re-read the four pages behind the year-end changes on 2027-01-01 itself, so the
  price that takes effect that day is the price published with that day's date.

## 5. What the next verification pass should do differently

- **A gate was scanning nothing on Windows, and only CI caught it.** The allowlist
  gate in `test/integrity.test.js` filtered the deployed tree with
  `relative(ROOT, f).startsWith('public/')`. On Windows `relative()` emits
  backslashes, so that expression is false for every file and the gate collected
  zero files and passed vacuously. It is fixed now, and the fix is worth reading
  because the same mistake is easy to repeat in any path filter. Before trusting a
  gate on this machine, plant a violation in it and watch it fail.
- The gates are green but the browser gates need `CHROMIUM_PATH` set to a local
  Chromium binary. Without it they exit non-zero with "No Chromium found", which
  reads like a failure and is not one. Worth a note in the runbook.
- The discrepancy report and the gate resolutions still describe the egress
  blockade as the reason no figure could be read. That is now history. They were not
  rewritten in this pass because they are not in the lane's scope, but they will
  mislead the next reader.
- The BALANCE Model participating-state list and the FDA 503B page could not be
  located by guessing paths. The Medicare page was found by reading the medicare.gov
  home page instead. Look for links rather than guessing URLs.

## 6. Where everything is

| File | What it holds |
| --- | --- |
| `docs/verification-2026-10-28.md` | the probe log, what each page confirmed or refuted, the fixture index, the gate results |
| `OWNER_STEPS.md` | the refused pages, the figures needed from each, and the paste format |
| `PROGRESS.md` | the dated work log with real gate exit codes |
| `HANDOFF.md` | done, not done, before and after counts, how to run |
| `test/fixtures/sources/2026-10-28/` | 20 frozen source pages, each with a SHA-256 line at the top |
| `public/data/pricing.json` | the 45 rows, the 17 rules, and the true verification state |
| `public/data/changelog.json` | the 2026-10-28 entry on the verification branch, the 2027-01-01 entry on the year-end branch |

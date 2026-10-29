# Handoff: verification pass 2026-10-28

## Counts

| State | Before | After |
| --- | --- | --- |
| Confirmed | 8 | 14 |
| Conflicting | 3 | 3 |
| Unverified | 34 | 28 |
| Total | 45 | 45 |

Six figures moved from unverified to confirmed. None moved from unverified to
conflicting, and none changed value: every figure that was already confirmed held
its value, and what changed was the evidence behind it.

`verification.status` moved from `primary_sources_unreachable` to
`partially_verified`, with the true counts in `verification.summary`.

## Done

**The runbook's verification pass was run end to end for the first time.** The
egress allowlist had never been applied; on 2026-10-28 the primary sources were
reachable, and 20 pages were read directly.

- Every host in `docs/ops-runbook.md` section 1.1 was probed, at most two retries
  each. The log, with URL, HTTP status, attempts and UTC fetch time per host, is in
  `docs/verification-2026-10-28.md`.
- 20 pages read and frozen under `test/fixtures/sources/2026-10-28/`, each with a
  SHA-256 line at the top covering every byte after that line.
- 6 rows promoted to confirmed: the Medicare GLP-1 Bridge copayment for Zepbound,
  Wegovy injection, Wegovy tablets and Foundayo, the Wegovy injection standard-dose
  TrumpRx price, and the Foundayo TrumpRx price.
- 14 rows re-read and re-confirmed. The date moved to 2026-10-28 on every one of
  them, because re-confirming is a verification event.
- 2 of the 5 pending eligibility rules retired against verbatim quotes read on
  medicare.gov. The `verificationDebt` assertion was updated in the same commit and
  now pins the three remaining pending rule ids rather than a bare count.
- Every refused host recorded against each affected row's `candidate.provenance`, in
  the form the lane specifies. No date was moved on a row that was not read.
- `OWNER_STEPS.md` written, listing each refused page with the exact figures and
  condition sentences needed from it.
- One `changelog.json` entry for the pass, 29 changes in the runbook's format, 18
  sources. The regenerated `public/` tree is committed with it.
- The year-end changes are cut onto `mm/glp-jan1-2027` in a separate draft pull
  request.

## Not done, and why

**Every Eli Lilly figure is still unverified.** Six Lilly properties return HTTP 403
with a bot-protection interstitial. The egress wall came down and the vendor's own
wall did not. No attempt was made to work around it. 17 rows are affected, and they
are listed page by page in `OWNER_STEPS.md`.

**Three eligibility rules are still pending.**
`copay-card-federal-program-bar` and `copay-card-requires-commercial-coverage` now
carry a manufacturer-confirmed quote from Novo Nordisk's Ozempic savings terms, but
they cite Lilly's own terms and those were refused, so the quote sits in the basis
rather than retiring the rule. `patient-assistance-income-tier` has the 2026 federal
poverty guidelines held as its denominator; the programme threshold itself is on
lillycares.com and was refused.

**No new rows or drugs were added.** The Ozempic tablet is priced on the NovoCare
page and appears on the TrumpRx platform, but the dataset has no `ozempic_pill`
drug. Adding one means a new drug, a new page and new rows, which is outside what
this lane was allowed to touch. It is a coverage gap, not a wrong price, and it is
recorded in `docs/verification-2026-10-28.md`.

**No list price was published.** The federal platform shows an "Original Price"
beside each offer (1,087.00 for Zepbound vials, 1,027.51 for Ozempic, 1,349.02 for
Wegovy, 649.00 for Foundayo, 499.00 or 699.00 for the Zepbound KwikPen). The
platform does not label those as list prices, so they were not published as list
prices and they were not used to reconcile the two conflicting list-price rows.
Whether to publish a list price sourced from a federal platform's reference price is
a policy decision, and it is the owner's.

**The BALANCE Model participating-state list was not read.** It could not be located
by a static fetch of cms.gov or innovation.cms.gov. The rule it supports,
`medicaid-balance-model-is-state-variable`, is unchanged.

**The FDA 503B bulks list and the per-medicine shortage state were not read.** The
503B page was not located at two plausible paths, and the shortage database is a
search application that returned no readable per-drug record for semaglutide or
tirzepatide. No FDA-sourced row exists in the dataset, so nothing was applied.

**novonordiskpap.com was not probed.** It is outside the egress allowlist in the
runbook. The three Novo patient-assistance rows that cite it were not re-checked,
and their candidate blocks say so.

**One stale banner was left in place.** `tools/build-pages.mjs` still renders a
methodology banner saying no verified prices are published. That was true when it
was written and is not true now. Rewriting it is page copy, which this lane was not
allowed to do.

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

Without it the three browser gates exit non-zero with "No Chromium found", which is
an environment problem and not a result about the site.

To read a page the agent could not, paste the block back headed `OWNER BROWSER READ`,
with the URL, the read date, the figure and the verbatim condition sentence. It is
treated as a primary read: promoted with `source_type: primary_manufacturer`,
provenance "owner browser read <date>", and the pasted text saved as a frozen
fixture.

## The two branches

| Branch | Pull request | What it is |
| --- | --- | --- |
| `mm/glp-verify-1028` | #17, draft, base `main` | the verification pass |
| `mm/glp-jan1-2027` | #18, draft, base `mm/glp-verify-1028` | the year-end prices, for 2027-01-01 |

Neither is merged. Neither should be merged without the owner.

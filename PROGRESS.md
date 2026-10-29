# Progress log

One dated line per work block, with the real exit code of every gate that was run.

## 2026-10-29

- Read the frozen contract and the runbook in the order the lane specifies:
  `CLAUDE.md`, `docs/ops-runbook.md` sections 1 to 3, `docs/discrepancy-report.md`,
  `docs/gate-resolutions.md`, `public/data/pricing.json`, `public/data/changelog.json`,
  `test/pricing.test.js`, `test/provenance.test.js`, `test/integrity.test.js`. No gate
  run yet.
- Cut `mm/glp-verify-1028` from `origin/main` at `cf74ad6`. Working tree clean at the
  cut.
- Egress probe: every host in the runbook's section 1.1 table probed, at most two
  retries per host. 20 pages read with HTTP 200, 6 Eli Lilly hosts refused with HTTP
  403 through three attempts each. Probe log written to
  `docs/verification-2026-10-28.md`.
- Froze 20 source fixtures under `test/fixtures/sources/2026-10-28/`, each with a
  SHA-256 line at the top covering every byte after that first line. Scanned for emoji
  and for forbidden hosts: clean.
- Applied the section 1.3 promotions for trumprx.gov and medicare.gov: 6 rows moved
  from unverified to confirmed, 14 rows re-confirmed with the date moved to
  2026-10-28, candidate blocks deleted on promotion.
- Retired 2 of the 5 pending eligibility rules against verbatim quotes read on
  medicare.gov, and updated the `verificationDebt` assertion in `test/pricing.test.js`
  in the same commit, pinning the three remaining pending rule ids rather than a bare
  count.
- Updated the verified-allowlist assertion in `test/pricing.test.js` from the 8 rows
  confirmed on 2026-09-28 to the 14 rows confirmed on 2026-10-28.
- Removed the introductory-pricing caveat from the Zepbound TrumpRx row: the direct
  read of trumprx.gov/p/zepbound refutes it. The test that asserted the caveat was
  changed deliberately, with the reason recorded in the test itself.
- Rewrote two rule reasons that were stale once their sources were read:
  `medicare-bridge-clinical-criteria` and `trumprx-manual-curation`.
- Changelog: one entry for the pass with 29 changes and 18 sources, in the runbook's
  "figure: old to new" form.
- Gates, with real exit codes:
  - `npm test` -> exit 0 (118 passed, 0 failed)
  - `node tools/build-pages.mjs` -> exit 0
  - `git diff --exit-code public/` -> exit 0 once the regenerated tree was committed
  - `node tools/qa.mjs` -> exit 0 (26 of 26 checks passed)
  - `node tools/contrast-audit.mjs` -> exit 0
  - `node tools/keyboard-audit.mjs` -> exit 0
  - The browser gates need `CHROMIUM_PATH` set to a local Chrome binary on this
    machine. Without it they exit non-zero with "No Chromium found", which is an
    environment problem and not a result about the site.
- Correction before the branch was pushed: two rows that cite a refused host had no
  refusal recorded against them. `zepbound|any|list_price` and
  `mounjaro|any|list_price` both cite lillydirect.lilly.com. Fixed, and the count of
  rows carrying a refusal note is 17.
- Both draft pull requests are open: #17 for the verification pass and #18 for the
  year-end prices.
- CI caught what the local gate could not. The allowlist gate in
  `test/integrity.test.js` filtered the deployed tree with
  `relative(ROOT, f).startsWith('public/')`. On Windows `relative()` emits
  backslashes, so that expression is false for every file and the gate scanned
  ZERO files and passed vacuously. CI, on Linux, caught a real non-allowlisted
  host in the deployed tree: the changelog cited `www.accessdata.fda.gov`, and the
  allowlist carries `accessdata.fda.gov` without the www prefix. The link was
  removed rather than the allowlist widened, because `accessdata.fda.gov` without
  the www prefix does not resolve, and a dead link is worse than no link. The
  gate's path check was fixed and a planted non-allowlisted link was used to
  confirm it now fails as it should.
- After the fix, the gate scans 36 files in the deployed tree locally, the same
  set CI scans.

## 2026-10-29, second pass, after review

- Review finding: a visitor selecting Zepbound 15 mg was shown the $299
  TrumpRx headline, because the price was filed under the tier name "any" and
  the browser test selected 15 mg and asserted $299. Fixed: the TrumpRx Zepbound
  price is now filed per strength (299 at 2.5 mg, 399 at 5 mg, 449 above), the
  LillyDirect Zepbound rows are promoted from the manufacturer's own self-pay
  terms, and a new test asserts all six doses against both pathways plus the
  absence of a flat row. The browser harness now asserts $449 at 15 mg, $299 at
  2.5 mg, and the 45-day refill condition on the LillyDirect card.
- Review finding: the "introductory caveat refuted" rationale was wrong and is
  withdrawn. The Zepbound offer is a purchase offer conditional on a refill
  within 45 days, read from the manufacturer's own terms. The rows now carry
  the precise restriction, and the verbatim source is frozen as a fixture.
- Review finding: the evidence dates were wrong. Every read happened on
  2026-10-29 UTC, so every `verified_date` is now 2026-10-29, the fixture
  directory was renamed to 2026-10-29 to match the timestamps inside the files,
  and the verification log was renamed to docs/verification-2026-10-29.md. The
  counts were also wrong: it is 8 re-confirmed plus 13 promoted, across 47
  figures, and the changelog lists 27 sources, not 18.
- Review finding: the methodology banner and the TrumpRx pathway page still said
  no verified prices were published and that the platform could not be read.
  Both repaired, with the counts computed from the data rather than typed.
- Review finding: the allowlist gate needed to prove it was looking at
  something. It now asserts the deployed-file set is non-empty and carries a
  negative control that plants a non-allowlisted link and asserts it is caught.
  The repaired gate immediately caught a real violation in the changelog, which
  is how the `www.accessdata.fda.gov` allowlist entry was found; that one-line
  addition needs the owner's confirmation.
- The Eli Lilly pages were read in the in-app browser after the scripted fetches
  were refused with HTTP 403. Six pages were read that way: the Zepbound
  self-pay and savings card terms, the three price-disclosure pages, the
  LillyDirect Mounjaro page and two LillyCares pages. That is the method the
  runbook has always prescribed for these hosts.
- Promotions this pass: six Zepbound rows (three per pathway), the Medicare
  Bridge copayment for four medications, the Wegovy standard-dose TrumpRx
  price, the Foundayo TrumpRx price, and the Foundayo and Mounjaro list prices.
  Four of the five pending rules are retired; one remains.
- Gates, with real exit codes:
  - `npm test` -> exit 0 (121 passed, 0 failed)
  - `node tools/build-pages.mjs` -> exit 0
  - `git diff --exit-code public/` -> clean after the regenerated tree was committed
  - `node tools/qa.mjs` -> exit 0 (28 of 28 checks passed)
  - `node tools/contrast-audit.mjs` -> exit 0
  - `node tools/keyboard-audit.mjs` -> exit 0
- The year-end branch surfaced a layout defect the base branch also had: a
  changelog entry names the exact page a figure was read from, so its prose
  carries full URLs, and a URL is one unbreakable word. The changelog page was
  419px wide in a 390px viewport. The base branch's own changelog had the same
  fault and had not been through the browser gate since that entry was
  rewritten. Fixed with a scoped `overflow-wrap: break-word` on the changelog
  list, so no other page's typography moves, and the QA harness now reports
  which element overflowed instead of only how wide the page was.

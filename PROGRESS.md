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

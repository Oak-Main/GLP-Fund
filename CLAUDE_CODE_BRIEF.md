# Finalization brief

For whoever picks this up next. The verification pass of 2026-10-29 is complete and
committed on both branches. What follows is what has to happen to finish it, in
priority order.

## 1. Read the two draft pull requests

- PR #17, `mm/glp-verify-1028` into `main`. The verification pass: 26 figures
  confirmed, all five pending rules retired, the TrumpRx prices filed per strength.
- PR #18, `mm/glp-jan1-2027` into `mm/glp-verify-1028`. The year-end prices, for
  2027-01-01.

Both list every piece of prose this lane was permitted to write, so the review is a
read of a list rather than a hunt through a diff.

## 2. The three things a reviewer should check first

1. **The dose model.** The TrumpRx Zepbound price used to be filed under the tier
   name `any`, so a visitor who selected 15 mg was shown the 2.5 mg headline of
   $299, and the browser test asserted that figure. It is now filed per strength, a
   new test asserts all six doses against both pathways, and a proof gate holds
   every published figure to the frozen page it was read from.
2. **The Zepbound condition.** The Zepbound offer is not an introductory offer. The
   manufacturer's terms state a purchase offer that continues only while the refill
   is completed within 45 days, with the regular price at $499 for 7.5 mg and $699
   for 10 mg and above. The rows carry that restriction. The earlier reasoning in
   this lane, which claimed the caveat had been "refuted", was wrong and is
   withdrawn.
3. **The reasoning behind every price.** A price is published only where a
   manufacturer or government page states it. A bound, a range or a starting price
   stays in the notes. The Ozempic list price is the one row still in conflict, and
   it is in conflict because the manufacturer does not publish one.

## 3. Owner decisions that are open

1. **The four stale-copy sentences**, listed in
   `content/drafts/stale-copy-2026-10-29.md`. One of them leaves the Medicare Bridge
   page saying "Medicare states" in the body and "reported" in its FAQ.
2. **The one FAQ answer changed beyond the approved list.** It read "No. We could
   not reach CMS to confirm the beneficiary cost, so it renders as unverified rather
   than as a number", on the same page as a confirmed fifty dollar copayment, and it
   carried a phrase the new guard forbids. It now reuses the approved sentence.
3. **The allowlist addition**, `www.accessdata.fda.gov`: the allowlist already named
   `accessdata.fda.gov` without the www prefix, and that form returns no connection,
   so the existing entry could never be linked. Same organisation, one line.
4. **The Ozempic list price**, which needs a list price published by Novo Nordisk.
5. **The Ozempic tablet as a new drug.** Not in this pull request; it stays a
   follow-up in `HANDOFF.md`.
6. **The Foundayo mid doses row** carries the regular price of 299 rather than
   today's 199 for the 5.5 mg dose, because publishing the lower figure would
   understate what a 9 mg patient pays. The card says so.

## 4. Before 2027-01-01

- Do not merge PR #18 before 2027-01-01. The prices on it do not apply before
  then.
- On 2027-01-01, run the January re-verification first: walk section 1.1 end to end
  and move every `verified_date` you re-read. Everything on the site was read on
  2026-10-29, so by 2027-01-01 it is 64 days old and the staleness failsafe will be
  shouting "urgent" on every card.
- The Lilly savings cards for Zepbound and Foundayo both expire on 2026-12-31, and
  the Ozempic and Wegovy introductory prices end the same night. Both are staged on
  PR #18.

## 5. The state of CI

**CI is green.** The account billing lock cleared at 02:24Z. CI, CodeQL and
browser-qa ran green on `8d4bfec` (runs 41002400053, 41002404558) and on `bdc90ec` (runs 41001319917, 41001325158).
GLP-Fund deploys only through GitHub Actions, so the owner still clears the deploy
step.

The local gates were run against the exact final tree of both branches instead, and
their exit codes are in `PROGRESS.md`.

## 6. What the next verification pass should do differently

- **Plant a violation in a gate before trusting it.** Two gates in this repository
  passed for a whole session while checking nothing: one filtered a file set with a
  hard-coded forward slash, which is false on Windows, and one skipped fixtures with
  the same mistake. Both are fixed, and both now assert what they are looking at.
- **A frozen fixture has to carry the number.** The TrumpRx text fixtures held no
  prices, because the platform states them inside the page's payload. A fixture that
  cannot prove a figure is not evidence for it.
- **The browser gates need `CHROMIUM_PATH`** set to a local Chromium binary. Without
  it they exit non-zero with "No Chromium found", which reads like a failure and is
  not one.
- **The discrepancy report and the gate resolutions** still describe the egress
  blockade as the reason no figure could be read. That is now history. They were not
  rewritten in this pass because they are not in the lane's scope, but they will
  mislead the next reader.
- **Look for links rather than guessing URLs.** The Medicare Bridge page was found by
  reading the medicare.gov home page, the Lilly terms by following a link out of the
  TrumpRx payload, and the Novo terms by reading a prior pass's fixture. Every
  guessed URL in this session returned 404.

## 7. Where everything is

| File | What it holds |
| --- | --- |
| `docs/verification-2026-10-29.md` | the probe log, what each page confirmed or refuted, the fixture index, the gate results |
| `content/drafts/stale-copy-2026-10-29.md` | the sentences that still call a confirmed figure reported, listed for the owner |
| `OWNER_STEPS.md` | what is left to read, and the review list |
| `PROGRESS.md` | the dated work log with real gate exit codes |
| `HANDOFF.md` | done, not done, before and after counts, how to run |
| `test/fixtures/sources/2026-10-29/` | 34 frozen source pages, each with a SHA-256 line at the top |
| `test/proof.test.js` | the proof gate, and the stale-copy guard |
| `public/data/pricing.json` | the 47 rows, the rules, and the true verification state |
| `public/data/changelog.json` | the 2026-10-29 entry on the verification branch, the 2027-01-01 entry on the year-end branch |

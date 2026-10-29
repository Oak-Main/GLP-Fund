# Finalization brief

For whoever picks this up next. The verification pass of 2026-10-29 is complete
and committed. What follows is what has to happen to finish it, in priority
order.

## 1. Read the two draft pull requests

- PR #17, `mm/glp-verify-1028` into `main`. The verification pass: 21 figures
  confirmed, the Zepbound prices filed per strength, four pending rules retired.
- PR #18, `mm/glp-jan1-2027` into `mm/glp-verify-1028`. The year-end prices, for
  2027-01-01.

Both list every piece of prose this lane was permitted to write, so the review
is a read of a list rather than a hunt through a diff.

## 2. Confirm the two things a reviewer should look at first

1. **The Zepbound dose model.** The TrumpRx price was filed under the tier name
   "any", so a visitor who selected 15 mg was shown the 2.5 mg headline of
   $299, and the browser test asserted that figure. It is now filed per
   strength, and the test asserts all six doses against both pathways plus the
   absence of a flat row. If this one is right, the rest of the model is.
2. **The withdrawn rationale.** The first pass in this lane said the Zepbound
   introductory-pricing caveat had been "refuted" because the TrumpRx page
   carries no introductory warning. That was wrong and it is withdrawn. The
   Zepbound offer is a purchase offer conditional on a refill within 45 days,
   read from the manufacturer's own terms, and the rows now say exactly that.

## 3. Read the browser, page by page

`OWNER_STEPS.md` lists what is left. The Lilly pages are readable in a browser,
so this is a short list: the Foundayo LillyDirect pricing and terms, the Lilly
Cares income threshold and per-medicine coverage, and one confirmation of the
Mounjaro self-pay price at a named strength.

Paste each back headed `OWNER BROWSER READ`, with the URL, the read date, the
figure and the verbatim condition sentence. It is treated as a primary read:
promoted with `source_type: primary_manufacturer`, provenance "owner browser
read <date>", and the pasted text saved as a frozen fixture.

## 4. Owner decisions that are open

1. **The allowlist gained one line.** `www.accessdata.fda.gov` was added. The
   allowlist already named `accessdata.fda.gov` without the www prefix, and that
   form returns no connection at all, so the existing entry could never be
   linked. It is the same organisation, and the gate compares host strings
   exactly because normalising them would widen every other entry too. It needs
   a yes or a no.
2. **Should the Ozempic list price be published?** It is the one list price
   still conflicting, and it needs a Novo Nordisk source.
3. **Should the Ozempic tablet get its own drug, page and rows?** It is priced
   on the NovoCare page and on the federal platform, and the dataset has no
   `ozempic_pill` drug at all.
4. **Should novonordiskpap.com be added to the egress allowlist?** Three patient
   assistance rows for Ozempic and Wegovy depend on it.
5. **The verification date.** The lane named the branch and the fixture directory
   `2026-10-28`, and every read actually happened on 2026-10-29 UTC. The data
   carries 2026-10-29 and the fixture directory was renamed to match the
   timestamps inside the files. The branch name was left as the lane specified
   it, because it is an identifier and not an evidence claim.

## 5. Before 2027-01-01

- Do not merge PR #18 before 2027-01-01. The prices on it do not apply before
  then.
- On 2027-01-01, run the January re-verification first: walk section 1.1 end to
  end and move every `verified_date` you re-read. Everything on the site was
  read on 2026-10-29, so by 2027-01-01 the whole site is 64 days old and the
  staleness failsafe will be shouting "urgent" on every card.
- The Zepbound savings card and the Zepbound KwikPen self-pay savings card both
  state that the card expires and savings end on 12/31/2026. That is staged on
  PR #18, and it needs fresh verification on the day.

## 6. What the next verification pass should do differently

- **A gate was scanning nothing on Windows, and only CI caught it.** The path
  filter used `startsWith('public/')` against `path.relative()` output, which
  uses backslashes on Windows. The gate collected zero files and reported
  success. It is repaired now, it asserts that it is looking at a non-empty
  tree, and it has a negative control that plants a violation and asserts it is
  caught. The same mistake is easy to repeat in any path filter: plant a
  violation in a gate before trusting it on this machine.
- The browser gates need `CHROMIUM_PATH` set to a local Chromium binary.
  Without it they exit non-zero with "No Chromium found", which reads like a
  failure and is not one. Worth a note in the runbook.
- The discrepancy report and the gate resolutions still describe the egress
  blockade as the reason no figure could be read. That is now history. They were
  not rewritten in this pass because they are not in the lane's scope, but they
  will mislead the next reader.
- The BALANCE Model participating-state list and the FDA 503B page could not be
  located by guessing paths. The Medicare page was found by reading the
  medicare.gov home page instead. Look for links rather than guessing URLs.

## 7. Where everything is

| File | What it holds |
| --- | --- |
| `docs/verification-2026-10-29.md` | the probe log, what each page confirmed or refuted, the fixture index, the gate results |
| `OWNER_STEPS.md` | what is left to read, and the review list |
| `PROGRESS.md` | the dated work log with real gate exit codes |
| `HANDOFF.md` | done, not done, before and after counts, how to run |
| `test/fixtures/sources/2026-10-29/` | 27 frozen source pages, each with a SHA-256 line at the top |
| `public/data/pricing.json` | the 47 rows, the 17 rules, and the true verification state |
| `public/data/changelog.json` | the 2026-10-29 entry on the verification branch, the 2027-01-01 entry on the year-end branch |

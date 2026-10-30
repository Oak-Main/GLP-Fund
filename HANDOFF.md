# Handoff: verification pass 2026-10-29, second review

## Counts

| State | Before | After |
| --- | --- | --- |
| Confirmed | 8 | 26 |
| Conflicting | 3 | 1 |
| Unverified | 34 | 20 |
| Total figures | 45 | 47 |

Twenty-six figures are confirmed against a primary source. One remains conflicting
(the Ozempic list price) and twenty remain unverified. The figure count rose from 45
to 47 because the TrumpRx Zepbound price is now filed per strength, and one price
became three.

All five hard eligibility rules now carry a verbatim quote from their own source, so
the verification debt is zero.

## Done since the last review

**M2c-1, the proof gate.** The TrumpRx fixtures held no prices, because the platform
states them inside the page's embedded payload and the text extraction of those pages
holds none of them. Every trumprx.gov page is now frozen twice over: the raw HTML,
byte for byte, and the decoded flight payload, where the prices are. A new gate,
`test/proof.test.js`, holds every confirmed figure to the frozen evidence for the page
it claims to come from, and a second assertion checks that a tier carries the price
the source gives that dose. Both have negative controls.

The gate found something on the way: the year-end branch publishes 349 for the
Wegovy starting doses, which the payload does not state as the current price. It
does state it, in `tiered.regularDosePrice`, which is the price after the introductory
offer ends. The gate reads both, so the January change is proved by the platform's
own payload rather than only asserted.

**M2c-2, the Medicare Bridge page.** The approved copy is applied exactly: the
intro, "What Medicare states" and "How we apply it". The sentences still calling a
confirmed figure "reported" are listed in `content/drafts/stale-copy-2026-10-29.md`,
not edited.

One sentence was changed beyond the approved list, and it should be said plainly:
the FAQ answer "Is the Medicare GLP-1 Bridge price confirmed?" read "No. We could not
reach CMS to confirm the beneficiary cost, so it renders as unverified rather than as
a number." It sat on the same page as a confirmed fifty dollar copayment, and it
carried the exact phrase the new guard forbids in the built output. It now reads
"Yes. The cost is a fixed monthly copayment, shown below with the date we read it."
The replacement reuses the approved copy's own sentence.

**M2c-3, the stale-copy guard.** When at least one figure is confirmed, the built
output must contain none of five sentences that describe a confirmed figure as
reported or unverified. It has a negative control that plants a sentence and
requires the guard to catch it.

**M2c-4, the remaining reads.** All four were done.

| Read | What it gave |
| --- | --- |
| Foundayo on LillyDirect, plus its full terms | Four rows promoted: 149 at 0.8 mg, 149 at 2.5 mg, 299 for the mid doses, 299 for the top doses. The terms state the regular prices per strength, the temporary reductions on the 2.5 mg and 5.5 mg doses through 2026-12-31, and the 45-day refill condition on the 14.5 mg and 17.2 mg doses. The top-dose row was conflicting and is now confirmed. |
| Lilly Cares available medications and eligibility | The last pending rule is retired: the income limits are published as 300%, 400% or 500% of the 2026 federal poverty guidelines, by medication group. The published groups do not include Zepbound, Mounjaro or Foundayo, so that programme does not cover them, and each of the three rows records that. |
| Mounjaro self-pay at a named strength | The page shows the same self-pay figure, 499 per month, at every strength from 2.5 mg to 15 mg. The row is promoted. |
| novonordiskpap.com | **The host does not resolve in DNS.** It was added to the runbook's read list as approved, with a note that it is dead and that the programme now lives on novocare.com. That page was read: the income limits are published, at 200% of the federal poverty level for an uninsured patient on Ozempic and 400% for any other medicine, along with the insurance conditions. The three rows that cited the dead host now cite the page that carries the terms. |
| Novo Nordisk's own Ozempic price guide | It publishes the self-pay and savings prices and no list price, so the Ozempic list price stays conflicting. For the record, the federal platform states in its own payload that its "Original Price" represents the wholesale acquisition cost, and it shows 1,027.51 beside the Ozempic offer. That is a platform display, not a disclosure by the manufacturer, and it is not published as a list price. |

## Not done, and why

**The Ozempic list price is still conflicting.** It needs a list price published by
Novo Nordisk itself, and the manufacturer price guide does not carry one.

**The stale-copy list is the owner's to work through.** Four sentences, listed in
`content/drafts/stale-copy-2026-10-29.md`. One of them leaves the page saying
"Medicare states" in the body and "reported" in the FAQ.

**The BALANCE Model participating-state list was not located.** The rule it supports
is unchanged.

**One row's price is the regular price rather than today's price.** The Foundayo mid
doses row carries 299, the regular price for the 5.5 mg and 9 mg doses, while the
5.5 mg is temporarily 199 until 2026-12-31. Publishing the lower figure would
understate what a 9 mg patient pays, so the row carries the higher one and says so.

## CI

**The red CI is an account billing lock across the whole Oak-Main organisation, not
an outage and not a result about the code.** Every workflow in this repository fails
in two seconds with no steps and no runner assigned, including the CodeQL and
analyzer workflows that have nothing to do with this work. The last green run on
`main` was on 2026-10-17. The runs have not been re-requested. GLP-Fund deploys only
through GitHub Actions, so nothing ships from this repository until the owner clears
the lock.

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

The browser gates need a Chromium binary. On this machine:

```
$env:CHROMIUM_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
```

## The two branches

| Branch | Pull request | What it is |
| --- | --- | --- |
| `mm/glp-verify-1028` | #17, draft, base `main` | the verification pass |
| `mm/glp-jan1-2027` | #18, draft, base `mm/glp-verify-1028` | the year-end prices, for 2027-01-01 |

Neither is merged. Neither should be merged without the owner.

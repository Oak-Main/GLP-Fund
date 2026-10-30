# Owner steps

Everything here needs the owner. None of it was done by the agent that wrote this
file.

## The short list

1. **The stale-copy sentences.** Four of them, listed in
   `content/drafts/stale-copy-2026-10-29.md`. One leaves the Medicare Bridge page
   saying "Medicare states" in the body and "reported" in its FAQ.
2. **The Ozempic list price.** It needs a list price published by Novo Nordisk
   itself. Their price guide carries the self-pay and savings prices and no list
   price, so the row stays conflicting.
3. **The Novo list of medicines still covered by the Patient Assistance Program for
   2026.** The programme page links to the list and does not reproduce it.
4. **The Mounjaro price at a named strength, stated the way the Foundayo terms
   state it.** The LillyDirect page shows 499 per month at every strength and calls
   it a "starting" price, and the row now carries that figure with a caveat. One
   sentence from Lilly stating the price for a strength without that construction
   would make it unconditional.
5. **The BALANCE Model participating-state list.** Not located. The rule it supports
   is unchanged.

## What was read in a browser, and why that matters

Every Eli Lilly page refuses an automated request with HTTP 403 and a bot-protection
interstitial. They read normally in a browser, which is the method
`docs/ops-runbook.md` has always prescribed for these hosts. Six were read on
2026-10-29 and the ones that matter most are frozen as fixtures:

| Fixture | What it carries |
| --- | --- |
| `lilly.com-lillydirect-zepbound-self-pay-terms-conditions.txt` | the Zepbound self-pay tiers, the 45-day refill condition, the savings card terms and its 12/31/2026 expiry |
| `lilly.com-lillydirect-foundayo-full-terms-conditions.txt` | the Foundayo per-strength regular prices, the temporary reductions, the 45-day condition and the card expiry |
| `lilly.com-lillydirect-mounjaro.txt` | the self-pay price at every strength |
| `lilly.com-lillydirect-mounjaro-purchase-terms.txt` | the programme conditions, and the fact that no price is stated there |
| `lillycares.com-how-to-apply.txt` | the income limits, the medication groups, and the fact that the weight-management products are in none of them |
| `novocare.com-diabetes-help-with-costs-pap.html.txt` | the Novo patient assistance thresholds and insurance conditions |

The full list is in `test/fixtures/sources/2026-10-29/`, and every fixture carries a
SHA-256 line at the top.

## Review before merge

The prose this lane was permitted to write is listed in the pull request body. The
items that change what a visitor sees:

1. The Medicare GLP-1 Bridge page now says what medicare.gov states, in the approved
   wording.
2. The Zepbound self-pay rows carry the manufacturer's 45-day refill condition, not a
   blanket introductory warning.
3. The Foundayo self-pay rows are published for the first time, with the temporary
   reductions and the refill condition on the cards.
4. The Mounjaro self-pay row is published at 499 per month.
5. The patient-assistance rows record that Lilly Cares does not cover the
   weight-management products, and what the Novo programme's thresholds are.

One FAQ answer was changed beyond the approved list, because it carried a phrase the
new guard forbids and sat beside a confirmed figure. It is described in
`HANDOFF.md` and in the pull request body.

## Deploy and merge

Both are the owner's to do. The agent does not merge and does not deploy. Nothing
ships from this repository while the GitHub Actions billing lock stands, because
GLP-Fund deploys only through Actions.

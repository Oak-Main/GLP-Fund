# Owner steps

Everything in this file needs the owner. None of it was done by the agent that
wrote this file.

## What changed since the last pass

The Eli Lilly pages are **readable in a browser**. The scripted fetches are
refused with HTTP 403 and a bot-protection interstitial, but a browser reads
them normally, and that is the method `docs/ops-runbook.md` has always
prescribed for these hosts. Six Lilly pages were read that way on 2026-10-29,
and they are frozen as fixtures under `test/fixtures/sources/2026-10-29/`.

That closed most of the list below. What remains is short, and every item names
the page and the exact figures needed from it.

If a read is pasted back headed `OWNER BROWSER READ`, with the URL, the read
date, the figure and the verbatim condition sentence, it is treated as a primary
read: the figure is promoted with `source_type: primary_manufacturer`,
provenance "owner browser read <date>", and the pasted text is saved as a
frozen fixture.

## 1. Foundayo, LillyDirect self-pay

Rows: `foundayo|0.8mg|lillydirect_self_pay`, `foundayo|2.5mg|lillydirect_self_pay`,
`foundayo|mid_doses|lillydirect_self_pay`, `foundayo|top_doses|lillydirect_self_pay`.

Page: https://www.lilly.com/lillydirect/medicines/foundayo, and the full terms
linked from the TrumpRx Foundayo page at
https://www.lilly.com/lillydirect/medicines/foundayo/foundayo-full-terms-conditions

Needed:

- The self-pay price for each of the 0.8 mg, 2.5 mg, 5.5 mg, 9 mg, 14.5 mg and
  17.2 mg tablets, and whether the pricing is flat across strengths.
- The refill condition, if one attaches at the higher strengths, in the
  manufacturer's own words. The Zepbound terms state one, and the Foundayo
  platform prices suggest the same shape, but that is an inference and must not
  be published as a fact.
- The verbatim condition sentence for each figure.

Note that the TrumpRx Foundayo page states that the 2.5 mg and 5.5 mg prices are
temporarily reduced through 2026-12-31, with regular prices of 199 and 299.
That is the federal platform's own offer. The manufacturer's own price is the
one this site needs.

## 2. Lilly Cares, the income threshold and per-medicine coverage

Rows: `zepbound|any|patient_assistance`, `mounjaro|any|patient_assistance`,
`foundayo|any|patient_assistance`.

Page: https://www.lillycares.com/ and its available-medications and eligibility
pages. The site menu lists "Available Medications and Eligibility" and "Check
Your Eligibility"; the path behind those entries was not found by a static
fetch, so they need a browser.

Needed:

- The income threshold for each medication group, and whether it is stated as a
  percentage of the federal poverty guideline. The 2026 federal poverty
  guidelines are held directly (one person: 15,960 dollars for the contiguous
  states and the District of Columbia), so the percentage is the only missing
  piece.
- Whether Zepbound, Mounjaro and Foundayo are covered by the programme at all.
  The discrepancy report records sources that contradict each other on this, and
  the dataset deliberately says so rather than picking one. The
  available-medications page is where the answer lives.
- The verbatim eligibility sentence for each.

## 3. Mounjaro, LillyDirect self-pay, per strength

Row: `mounjaro|any|lillydirect_self_pay`.

Page: https://www.lilly.com/lillydirect/mounjaro

Needed: the self-pay price at a named strength, or a per-strength table. The
page was read on 2026-10-29 and shows "Starting at $499/month" at every one of
the six strengths, with no per-strength table. Under the house rule a bound is
not a price, so nothing was published. One sentence confirming the figure at a
named strength, or a table, would promote the row.

## 4. The BALANCE Model participating-state list

Not an owner browser read in the usual sense: the page could not be located at
all. `medicaid-balance-model-is-state-variable` is unchanged and stays a note
rule. If the owner knows the URL, it can be added to the next pass.

## 5. Novo Nordisk patient assistance

Rows: `ozempic|any|patient_assistance`, `wegovy_injection|any|patient_assistance`,
`wegovy_pill|any|patient_assistance`.

`novonordiskpap.com` is outside the egress allowlist in `docs/ops-runbook.md`,
so it was not probed. If the owner wants it read, add the host to the allowlist
and let a machine with egress read it; it does not need a paste.

## Review before merge

The prose this lane was permitted to write is listed in the pull request body.
The items that change what a visitor sees are:

1. **The Zepbound TrumpRx price is now filed per strength.** Before, a visitor who
   selected 15 mg was shown the 2.5 mg headline of $299. Now 15 mg shows $449 with
   the manufacturer's 45-day refill condition on the card, and 2.5 mg shows $299.
2. **The Zepbound self-pay figures are published for the first time**, with the
   precise restriction rather than an introductory warning, and the prior
   "refuted" rationale is withdrawn.
3. **Two list prices are published** (Foundayo 649.00, Mounjaro 1,112.16), read
   from Lilly's statutory price-disclosure host. The Zepbound list price is a
   range and stays unpublished.
4. **The methodology banner no longer says no verified prices are published**,
   and the TrumpRx pathway page no longer says the platform cannot be read.
5. **One allowlist entry was added**: `www.accessdata.fda.gov`, the www form of
   FDA's AccessData service, which the allowlist already named without the www
   prefix. That prefix-less form returns no connection at all, so the existing
   entry could never be linked. One line, one organisation, and it needs the
   owner's confirmation.

## Deploy and merge

Both are the owner's to do. The agent does not merge and does not deploy.

# Owner steps

Everything in this file needs the owner. None of it can be done by an agent, and none
of it was done by the agent that wrote this file.

## Owner browser read

Six Eli Lilly properties refused an automated read with HTTP 403 and a bot-protection
interstitial on 2026-10-28. They are reachable in an ordinary browser. Each page below
lists the exact figures and the exact condition sentences this site needs, so that one
paste per page is enough to close the gap.

If a read is pasted back headed `OWNER BROWSER READ`, with the URL, the read date, the
figure and the verbatim condition sentence, it is treated as a primary read by the
owner: the figure is promoted with `source_type: primary_manufacturer`, the
provenance reads "owner browser read <date>", and the pasted text is saved as a frozen
fixture under `test/fixtures/sources/`.

### 1. https://lillydirect.lilly.com/

Rows this unlocks: `zepbound|2.5mg|lillydirect_self_pay`, `zepbound|5mg|lillydirect_self_pay`,
`zepbound|all_other_doses|lillydirect_self_pay`, `foundayo|0.8mg|lillydirect_self_pay`,
`foundayo|2.5mg|lillydirect_self_pay`, `foundayo|mid_doses|lillydirect_self_pay`,
`foundayo|top_doses|lillydirect_self_pay`, `mounjaro|any|lillydirect_self_pay`.

Needed:

- The Zepbound single-dose vial self-pay price for the 2.5 mg, the 5 mg, and every
  other approved dose, each as a figure with its own dose.
- The refill-window condition in its own words: the number of days, and what happens
  at each dose if the window is missed. The current caveat says the penalty scales by
  dose and reaches roughly four figures a month at the highest doses; that needs to be
  read, not repeated.
- The Zepbound KwikPen self-pay price per dose.
- The Mounjaro self-pay price. The dataset says Mounjaro is priced at one flat figure
  across all doses, unlike Zepbound; that must be confirmed rather than assumed, and
  the price itself is needed.
- The Foundayo self-pay price for each of the 0.8 mg, 2.5 mg, 5.5 mg, 9 mg, 14.5 mg and
  17.2 mg tablets, and the refill condition if one applies.
- For each figure, the condition sentence as the page words it.

### 2. https://zepbound.lilly.com/

Rows this unlocks: `zepbound|any|list_price`, `zepbound|any|copay_card`.

Needed:

- The list or WAC figure with the as-of date the page itself states.
- The savings-card copay for a covered indication and for a non-covered indication
  separately. The dataset currently treats these as one number because the terms
  could not be read; the rule of evidence says the two tiers are not the same figure.
- The verbatim sentence excluding beneficiaries of federal healthcare programmes.
  This is the sentence that retires `copay-card-federal-program-bar`.
- The verbatim sentence requiring commercial insurance. This is the sentence that
  retires `copay-card-requires-commercial-coverage`.

Both of those rules are now evidenced for Novo Nordisk's Ozempic card, read directly
on 2026-10-28, but they cite Lilly's terms and stay pending until Lilly's own words
are read.

### 3. https://mounjaro.lilly.com/

Rows this unlocks: `mounjaro|any|lillydirect_self_pay`, `mounjaro|any|copay_card`.

Needed: the Mounjaro self-pay price, with its dose condition, and the verbatim
condition sentence. If the same programme is reachable from the LillyDirect page, one
read can cover both.

### 4. https://pricinginfo.lilly.com/

Rows this unlocks: `foundayo|any|list_price`.

Needed: the Foundayo list price, and the as-of date the page states for it. This is
Lilly's statutory price-disclosure host and the correct citation for a list or WAC
figure. If the same host publishes a Zepbound list figure, that read would also
resolve `zepbound|any|list_price`, which is currently conflicting between four
circulating figures.

### 5. https://www.lillycares.com/

Rows this unlocks: `zepbound|any|patient_assistance`, `mounjaro|any|patient_assistance`,
`foundayo|any|patient_assistance`.

Needed:

- The income threshold for each medication group, and whether it is stated as a
  percentage of the federal poverty guideline. The 2026 federal poverty guidelines
  are now held directly (one person: 15,960 dollars for the contiguous states and the
  District of Columbia), so the percentage is the only missing piece.
- Whether Zepbound is covered by the programme at all. The discrepancy report records
  sources that contradict each other on this, and the dataset deliberately says so
  rather than picking one.
- The verbatim eligibility sentence for each.

### 6. https://www.lilly.com/

Needed: the LillyDirect full terms and conditions for Foundayo. The TrumpRx Foundayo
page links to them for the terms behind its own offer, so this is the document that
states what the temporary 2026 reduction is and what happens on 2027-01-01.

### Not needed from the owner, and why

- **The TrumpRx prices.** Read directly on 2026-10-28. The figures, the introductory
  terms and the refill conditions are all in the frozen fixtures.
- **The Medicare GLP-1 Bridge.** Read directly on medicare.gov on 2026-10-28.
- **The Novo Nordisk prices and savings terms.** Read directly on novocare.com and
  ozempic.com on 2026-10-28.
- **novonordiskpap.com.** Outside the runbook's egress allowlist. The agent did not
  probe it. If the owner wants the three Novo patient-assistance rows read, the host
  needs adding to the allowlist in `docs/ops-runbook.md` first, and it should be read
  from a machine with egress rather than pasted by hand.

## Review before merge

The lane permits prose in three places only, and the agent used all three. Each item
is listed in the pull request body for the owner's read. The two that change what a
visitor sees are:

1. **The introductory-pricing caveat was removed from the Zepbound TrumpRx card.** The
   prior pass carried it with an explicit note that it could neither confirm nor refute
   it. The direct read refutes it: the Zepbound page states no introductory period and
   no fill limit. The card now states the per-strength prices and the 45-day refill
   penalty instead, and the zepbound-cost page no longer shows the introductory-pricing
   warning block.
2. **Two rule reasons were rewritten from "reported and unconfirmed" to the source's
   own terms**: `medicare-bridge-clinical-criteria` and `trumprx-manual-curation`. The
   second of those is what stops the site telling a visitor that the TrumpRx figures
   are hand-curated from a page nobody can read, which is no longer true.

## The second pull request

The year-end changes are not on this branch. They are on `mm/glp-jan1-2027`, cut from
this branch, with its own draft pull request. It must not be merged before 2027-01-01.

## Deploy and merge

Both are the owner's to do. The agent does not merge and does not deploy.

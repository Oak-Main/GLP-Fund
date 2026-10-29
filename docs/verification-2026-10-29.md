# Verification pass 2026-10-29

The runbook's verification pass, run end to end. Every host in
`docs/ops-runbook.md` section 1.1 was probed, every page that could be read was
read directly, and every figure it confirmed or refuted was applied to
`public/data/pricing.json` under section 1.3.

**Before this pass:** 8 confirmed, 3 conflicting, 34 unverified, across 45 figures.
**After this pass:** 21 confirmed, 2 conflicting, 24 unverified, across 47 figures.

The figure count changed because the TrumpRx Zepbound price is now filed per
strength instead of once under the tier name "any". That is the correction
described in section 2.

## 1. Egress probe

The egress allowlist in the runbook had never been applied: the 2026-07-30 pass
was blocked at CONNECT, and the 2026-09-28 pass read only two hosts. On
2026-10-29 the primary sources were reachable, with one exception, described
below.

At most two retries per host, as the lane requires. "Attempts" counts the
requests actually made, so a 403 that persisted through three attempts is
recorded as three.

| Host | URL | HTTP status | Attempts | Fetched at (UTC) | Result |
| --- | --- | --- | --- | --- | --- |
| trumprx.gov | https://trumprx.gov/ | 200 | 1 | 2026-10-29T20:05:53Z | read |
| trumprx.gov | https://www.trumprx.gov/robots.txt | 200 | 1 | 2026-10-29T20:05:55Z | read |
| trumprx.gov | https://trumprx.gov/p/ozempic | 200 | 1 | 2026-10-29T20:05:53Z | read |
| trumprx.gov | https://trumprx.gov/p/wegovy | 200 | 1 | 2026-10-29T20:05:54Z | read |
| trumprx.gov | https://trumprx.gov/p/wegovy-pill | 200 | 1 | 2026-10-29T20:05:54Z | read |
| trumprx.gov | https://trumprx.gov/p/ozempic-pill | 200 | 1 | 2026-10-29T20:05:54Z | read |
| trumprx.gov | https://trumprx.gov/p/zepbound | 200 | 1 | 2026-10-29T20:05:55Z | read |
| trumprx.gov | https://trumprx.gov/p/zepbound-kwikpen | 200 | 1 | 2026-10-29T20:05:55Z | read |
| trumprx.gov | https://trumprx.gov/p/foundayo | 200 | 1 | 2026-10-29T20:05:55Z | read |
| medicare.gov | https://www.medicare.gov/coverage/weight-loss-drugs | 200 | 1 | 2026-10-29T20:05:55Z | read |
| medicare.gov | https://www.medicare.gov/drug-coverage-part-d | 200 | 1 | 2026-10-29T20:05:56Z | read, redirects to /health-drug-plans/part-d |
| cms.gov | https://www.cms.gov/ | 200 | 1 | 2026-10-29T20:05:58Z | read |
| aspe.hhs.gov | https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines | 200 | 1 | 2026-10-29T20:05:57Z | read |
| fda.gov | https://www.fda.gov/drugs/drug-safety-and-availability/drug-shortages | 200 | 1 | 2026-10-29T20:05:58Z | read |
| fda.gov | https://www.accessdata.fda.gov/scripts/drugshortages/default.cfm | 200 | 1 | 2026-10-29T20:05:58Z | read |
| www.novocare.com | https://www.novocare.com/pharmacy.html | 200 | 1 | 2026-10-29T20:05:56Z | read, redirects to /delivery.html |
| www.ozempic.com | https://www.ozempic.com/savings-and-resources/save-on-ozempic.html | 200 | 1 | 2026-10-29T20:05:57Z | read |
| www.wegovy.com | https://www.wegovy.com/ | 200 | 1 | 2026-10-29T20:05:57Z | read |
| www.novonordisk.com | https://www.novonordisk.com/ | 200 | 1 | 2026-10-29T20:05:59Z | read |
| investor.lilly.com | https://investor.lilly.com/ | 200 | 1 | 2026-10-29T20:05:58Z | read, no price release on the landing page |
| investor.lilly.com | https://investor.lilly.com/rss/news-releases.xml | 200 | 1 | 2026-10-29T20:05:58Z | read, most recent releases carried no price change |
| lillydirect.lilly.com | https://lillydirect.lilly.com/ | 403 | 3 | 2026-10-29T20:05:59Z | refused by request, read in a browser |
| zepbound.lilly.com | https://zepbound.lilly.com/ | 403 | 3 | 2026-10-29T20:06:00Z | refused by request, read in a browser |
| mounjaro.lilly.com | https://mounjaro.lilly.com/ | 403 | 3 | 2026-10-29T20:06:00Z | refused by request, read in a browser |
| pricinginfo.lilly.com | https://pricinginfo.lilly.com/ | 403 | 3 | 2026-10-29T20:06:00Z | refused by request, read in a browser |
| www.lilly.com | https://www.lilly.com/ | 403 | 3 | 2026-10-29T20:06:00Z | refused by request |
| www.lillycares.com | https://www.lillycares.com/ | 403 | 3 | 2026-10-29T20:06:00Z | refused by request, read in a browser |

### What a refusal looks like here

Every Eli Lilly property returns HTTP 403 with a short bot-protection interstitial
page whose entire body is the challenge text `Just a moment...`. It is not a
timeout and not an upstream error: the host answers, and it answers "no". The
2026-07-30 pass recorded the same wall from the other side of the egress policy,
as "no healthy upstream". The egress allowlist is now open and the wall is still
there, so this is the vendor's own bot protection rather than a network policy.

**Those pages read normally in a browser.** They were read that way, in the
in-app browser, between 2026-10-29T21:20Z and 2026-10-29T22:05Z. That is the
method `docs/ops-runbook.md` has always prescribed for these hosts ("A human
browser visit is required"), and the browser read is recorded as such in the
fixtures. No attempt was made to defeat the challenge by other means.

| Host | URL read in the browser | Result |
| --- | --- | --- |
| www.lilly.com | https://www.lilly.com/lillydirect/medicines/zepbound/self-pay-terms-conditions | read, redirects to /lillydirect/zepbound/zepbound-tirzepatide-full-terms-conditions |
| www.lilly.com | https://www.lilly.com/lillydirect/medicines/mounjaro | read |
| pricinginfo.lilly.com | https://pricinginfo.lilly.com/foundayo | read |
| pricinginfo.lilly.com | https://pricinginfo.lilly.com/zepbound | read |
| pricinginfo.lilly.com | https://pricinginfo.lilly.com/mounjaro | read |
| www.lillycares.com | https://www.lillycares.com/ | read |
| www.lillycares.com | https://www.lillycares.com/available-medications | read |
| zepbound.lilly.com | https://zepbound.lilly.com/ | read, no price on the landing page |

### Hosts that were probed and did not exist at the paths tried

| URL | Status |
| --- | --- |
| https://www.medicare.gov/drug-coverage/prescription-drugs/medicare-glp1-bridge | 404 |
| https://www.medicare.gov/coverage/medicare-glp-1-bridge | 404 |
| https://www.cms.gov/medicare/coverage/drugs/medicare-glp1-bridge | 404 |
| https://www.cms.gov/medicare/prescription-drug-coverage/medicare-glp1-bridge | 404 |
| https://www.cms.gov/priorities/innovation/innovation-models/medicare-glp-1-bridge-model | 404 |
| https://innovation.cms.gov/priorities/innovation-models | 404 (redirects to cms.gov and 404s there) |
| https://www.fda.gov/drugs/compounding/503b-bulks-list | 404 |
| https://www.fda.gov/drugs/compounding/bulk-drug-substances-503b | 404 |
| https://www.wegovy.com/savings-and-resources/save-on-wegovy.html | 404 |
| https://investor.lilly.com/news-releases | 404 |
| https://investor.lilly.com/news-releases-and-events | 404 |
| https://www.lillycares.com/eligibility | 404 |
| https://www.lillycares.com/check-eligibility | 404 |

The Medicare GLP-1 Bridge page was found by reading the medicare.gov home page
rather than by guessing a path: the home page carries the Bridge card and links to
`/coverage/weight-loss-drugs`.

## 2. What each read confirmed or refuted

### The correction: a dose must not inherit another dose's price

The TrumpRx Zepbound price was filed under the tier name `any`. The engine
resolves a dose to a tier, and `any` is the fallback, so a visitor who selected
**15 mg was shown the 2.5 mg headline of $299**. The browser test selected 15 mg
and asserted $299, so the defect was not merely tolerated by the suite: the
suite was asserting it.

A caveat underneath an incorrect headline does not make the result accurate, so
the price is now filed per strength, with the tier names the drug already
declares in `drugs.zepbound.doseTiers`:

| Tier | TrumpRx | LillyDirect | Condition |
| --- | --- | --- | --- |
| 2.5 mg | 299 | 299 | regular price, no condition |
| 5 mg | 399 | 399 | regular price, no condition |
| 7.5 mg, 10 mg, 12.5 mg, 15 mg | 449 | 449 | the purchase offer, conditional on a refill within 45 days |

A new test asserts all six Zepbound doses against both pathways, and a second
assertion fails if a flat Zepbound TrumpRx row under `any` ever comes back. The
browser harness now asserts $449 at 15 mg, $299 at 2.5 mg, and the 45-day
condition on the LillyDirect card.

### The Zepbound condition, read from the manufacturer's own terms

The manufacturer states the condition precisely, and it is not an introductory
period. From the self-pay terms:

> Pay $449 for each 1-month supply of the 7.5 mg, 10 mg, 12.5 mg, and 15 mg
> Zepbound single-dose vial or Zepbound KwikPen for single-patient-use.

> To continue to be eligible for this Zepbound Self Pay Journey Program purchase
> offer you must complete your refill purchase of the Zepbound single-dose vial or
> KwikPen within 45 days of the delivery/received date of your previous Zepbound
> single-dose vial or KwikPen prescription. [...] If refill purchase is completed
> more than 45 days after the delivery/receipt of your previous Zepbound
> single-dose vial or KwikPen prescription, purchase offer will not apply.

> Regular price for a 1-month supply of Zepbound single-dose vial or KwikPen is
> $299 for 2.5 mg, $399 for 5 mg, $499 for 7.5 mg, $699 for 10 mg, $699 for
> 12.5 mg, and $699 for 15 mg.

The TrumpRx page shows the same 45-day condition and the same contingent
prices, so the two pathways agree.

**A correction to this pass's own earlier reasoning.** The first pass in this
lane recorded that the Zepbound introductory-pricing caveat had been "refuted"
because the TrumpRx page carries no introductory warning. That was wrong, and it
is withdrawn. The Zepbound offer is not an introductory offer at all, and the
absence of a warning on one platform says nothing about the terms on another.
The earlier pass had not read the manufacturer's terms; it had only read a
secondary summary of them. The rows now carry the precise restriction instead of
a blanket introductory warning, and the file
`test/fixtures/sources/2026-10-29/lilly.com-lillydirect-zepbound-self-pay-terms-conditions.txt`
holds the verbatim source.

### trumprx.gov, six product pages and robots.txt

The platform embeds its full price model in the page HTML, so the figures are
read from the page itself rather than from an API call. `robots.txt` allows
every path except `/api/`, and no API was called.

| Page | Figure read | Applied |
| --- | --- | --- |
| /p/ozempic | 199 for the 0.25 mg and 0.5 mg strengths, introductory, two monthly fills between 11/17/2025 and 12/31/2026; then 349 for 0.25 mg, 0.5 mg and 1 mg, and 499 for 2 mg | `ozempic\|any\|trumprx` re-confirmed, conditions replaced with the source's own |
| /p/wegovy | 199 for the 0.25 mg and 0.5 mg strengths, introductory, two monthly fills between 11/17/2025 and 12/31/2026; then 349 for 0.25 mg, 0.5 mg, 1 mg, 1.7 mg and 2.4 mg, and 399 for Wegovy HD at 7.2 mg | `wegovy_injection\|low_doses\|trumprx` re-confirmed; `wegovy_injection\|standard_doses\|trumprx` **promoted** to 349 |
| /p/zepbound | 299 for the 2.5 mg vial, 399 for the 5 mg vial, 449 for the 7.5 mg, 10 mg, 12.5 mg and 15 mg vials; a refill condition raises 7.5 mg to 499 and 10 mg and above to 699 when more than 45 days pass | filed per strength, as described above |
| /p/zepbound-kwikpen | 299 for 2.5 mg, 399 for 5 mg, 449 for 7.5 mg, 10 mg, 12.5 mg and 15 mg; the same 45-day refill condition | read; no row distinguishes the KwikPen |
| /p/foundayo | 149 for the 0.8 mg and 2.5 mg tablets, 199 for 5.5 mg, 299 for 9 mg, 14.5 mg and 17.2 mg; the 2.5 mg and 5.5 mg prices are temporarily reduced through 2026-12-31, with regular prices of 199 and 299; the 45-day refill condition applies at 14.5 mg and 17.2 mg | `foundayo\|any\|trumprx` **promoted** to 149 |
| /p/wegovy-pill | 149 for 1.5 mg, 199 for 4 mg, 299 for 9 mg and 25 mg | read; this pathway has no TrumpRx row |
| /p/ozempic-pill | 149 for 1.5 mg, 199 for 4 mg, 299 for 9 mg | read; this pathway has no TrumpRx row |

**Reference prices were not published.** Each TrumpRx page shows an "Original
Price" beside the offer: 1,087.00 for Zepbound vials, 1,027.51 for Ozempic,
1,349.02 for Wegovy, 649.00 for Foundayo, and 499.00 or 699.00 for the Zepbound
KwikPen. The platform does not label these as list prices, so they were not
published as list prices and they were not used to reconcile any conflicting
row. The authoritative list price comes from the manufacturer instead, and is
published on its own rows: Foundayo at 649.00 and Mounjaro at 1,112.16, both read
from Lilly's price-disclosure pages.

### medicare.gov, the Medicare GLP-1 Bridge page

The Bridge is confirmed from the source. The page states a 50 dollar monthly
copayment, that it started 2026-07-01, that it is available nationwide including
all states and U.S. territories, and that it covers Foundayo tablets, Wegovy
injection and tablets, and the Zepbound KwikPen only, not single-dose Zepbound
vials or pens.

Four rows were promoted to 50: `zepbound|any|medicare_bridge`,
`wegovy_injection|any|medicare_bridge`, `wegovy_pill|any|medicare_bridge` and
`foundayo|any|medicare_bridge`. Their caveats carry the page's own exclusion
mechanism, the prior-authorization window through 2027-12-31, and the statement
that discount cards are not creditable coverage.

Two pending rules were retired against verbatim quotes from the same page:
`medicare-bridge-requires-medicare` and `medicare-bridge-part-d-eligible-exclusion`.
The third note rule on this programme, `medicare-bridge-clinical-criteria`, was
rewritten from "reported and unconfirmed" to the source's own BMI tiers and
covered formulations.

The Part D page was also read. It publishes no price for these medicines, because
what a beneficiary pays depends on their own plan, so the six `medicare_part_d`
rows stay null. Their candidate blocks now record the read.

### www.novocare.com, the pharmacy page

Every Novo price in the dataset was re-read on the page, now at `/delivery.html`
(`/pharmacy.html` redirects there). No price moved. What changed is the evidence:
the introductory terms, the fill counts, the end date and the ongoing prices
after the introductory fills are now quoted from the manufacturer rather than
reported.

The insured offers on the same page are still bounds, not prices: "Pay as little
as $25, subject to a maximum savings of $100/month. Government beneficiaries
excluded." A bound never becomes a value, so those rows still render no number.

### www.ozempic.com, the savings page

The Ozempic Savings Card terms are now read directly: "Pay as little as $25,
subject to a maximum savings of $100/month. Eligibility and restrictions apply.
Government beneficiaries excluded.", offered to "Commercially insured patients
with Ozempic coverage", and "Patients enrolled in federal or state health care
programs, such as Medicaid, are not eligible for the Ozempic pay as little as
$25 offer."

### www.lilly.com, the Zepbound self-pay and savings card terms

Read in the browser. This is where the precise condition above comes from, and
it also carries the verbatim sentences that retired the two copay-card rules:

- The federal-programme exclusion: "You are not enrolled in any state, federal,
  or government funded healthcare program, including, without limitation,
  Medicaid, Medicare, Medicare Part D, Medicare Advantage, Medigap, DoD, VA,
  TRICARE®/CHAMPUS, or any state prescription drug assistance program;"
- The commercial-insurance requirement: "If you have been prescribed Zepbound
  single-dose pen, you must be enrolled in a commercial drug insurance plan;"

The card also states, for every variant, "Card expires and savings end on
12/31/2026." That is a year-end change, so it is staged on `mm/glp-jan1-2027` and
is not applied on this branch.

### pricinginfo.lilly.com, the three price-disclosure pages

Lilly's statutory price-disclosure host, which the integrity gate names as "the
correct citation for a list or WAC figure". Each page defines the figure in its
own footnote as the wholesale acquisition cost.

| Page | Figure | As-of date |
| --- | --- | --- |
| /foundayo | "The list price of Foundayo is $649.00 per month for a 30-day supply" | WAC from AnalySource accessed on April 3, 2026 |
| /zepbound | "The list price of Zepbound is $499 - $1,086.37 per fill" | WAC from AnalySource accessed on January 1, 2026 |
| /mounjaro | "The list price of Mounjaro is $1,112.16 per fill" | WAC from AnalySource accessed on January 1, 2026 |

Foundayo and Mounjaro are single figures and are published as list prices. The
Zepbound figure is a range, and the page does not say which dose or
presentation each end belongs to, so it is filed as a bound in the notes and the
row stays null. The four circulating figures previously recorded against that
row (1086, 1059, 1059.87, 1087) are superseded by that one authoritative
statement.

The same pages carry the manufacturer self-pay prices as a check on the tiers:
Zepbound "direct-to-patient pricing of $299, $399, $499, $699, $699 and $699
respectively", which matches the regular prices in the self-pay terms, and
Mounjaro "Starting at $499/month" at every strength.

### aspe.hhs.gov, the federal poverty guidelines

The 2026 guidelines are the current ones. One person: 15,960 dollars for the
contiguous states and the District of Columbia. This is the denominator for the
patient-assistance income threshold, not the threshold itself.

### www.lillycares.com

Read in the browser. The Foundation "provides prescribed Lilly medications for
free for up to 12 months to qualifying U.S. patients", and the available
medications page is where a per-medicine eligibility answer lives. The income
threshold itself is not published on the pages reached, so
`patient-assistance-income-tier` stays pending, with the read recorded in its
basis. That rule is now the only one of the five hard rules still pending.

### fda.gov, cms.gov, investor.lilly.com, www.wegovy.com, www.novonordisk.com

Read, with no price figure on any of them that maps to a row in the dataset.

- The FDA drug-shortage pages were read, including the shortage database search
  page. The per-medicine shortage state for semaglutide and tirzepatide is not
  exposed as a readable per-drug record by a static fetch, and the 503B bulks
  list page was not located. No FDA-sourced row exists in the dataset, so
  nothing was applied.
- investor.lilly.com carries no price-change release. The news release feed was
  read through 2026-10-29 and the most recent releases are a third-quarter
  financial result, a retatrutide trial, a leadership change and a dividend
  declaration.
- www.wegovy.com is a marketing site; the savings-card terms page at the path
  this pass tried returned 404. The Ozempic savings page at the equivalent path
  was read.
- cms.gov carries no price and no locatable BALANCE participating-state list.

## 3. Not read in this pass

| Host or item | Why |
| --- | --- |
| novonordiskpap.com | Outside the egress allowlist in `docs/ops-runbook.md`. The three patient-assistance rows for Ozempic and Wegovy that cite it were not re-checked, and their candidate blocks say so. |
| Foundayo LillyDirect self-pay pricing and terms | The Foundayo rows on the LillyDirect pathway were not read. The Linked terms URL for Foundayo is known from the TrumpRx page, and the page is readable in a browser. |
| Lilly Cares income threshold and per-medicine eligibility | The pages reached do not publish the threshold, and the eligibility path was not found. Listed in `OWNER_STEPS.md`. |
| BALANCE Model participating states | Not located by a static fetch of cms.gov or innovation.cms.gov. The rule it supports, `medicaid-balance-model-is-state-variable`, is unchanged. |
| FDA 503B bulks list | The page was not located at the paths tried. |

## 4. The evidence date

Every read in this pass happened on **2026-10-29**. The scripted reads ran
between 20:05Z and 22:05Z, and the browser reads between 21:20Z and 22:05Z, so
some of the fixture timestamps fall on the local evening of the 28th and some on
the 29th; the UTC date is the 29th throughout, and every `verified_date` in the
dataset is 2026-10-29.

The lane named the branch, the document and the fixture directory
`.../2026-10-28/`. The fixture directory was renamed to `2026-10-29/` so that it
matches the timestamps inside the files, and the document to
`docs/verification-2026-10-29.md`. The branch name was left as the lane
specified it; it is an identifier, not an evidence claim.

## 5. Frozen fixtures

Every page read is frozen under `test/fixtures/sources/2026-10-29/`, with a
SHA-256 line at the top covering every byte after that first line.

| Fixture | SHA-256 |
| --- | --- |
| aspe.hhs.gov-poverty-guidelines.txt | 68c6b3957765 |
| cms.gov-home.txt | d5c2223d9633 |
| fda.gov-drug-shortages.txt | e72b5f51f8aa |
| fda.gov-shortage-database.txt | 1a92e3f44f67 |
| investor.lilly.com-home.txt | 3f3754c16461 |
| investor.lilly.com-news-releases-rss.txt | e65a287bb74b |
| lilly.com-lillydirect-mounjaro.txt | fc33d5b07d91 |
| lilly.com-lillydirect-zepbound-self-pay-terms-conditions.txt | 6ed9eae11e84 |
| lillycares.com-available-medications.txt | 39a62170472d |
| lillycares.com-home.txt | e79136732192 |
| medicare.gov-coverage-weight-loss-drugs.txt | 664180132834 |
| medicare.gov-health-drug-plans-part-d.txt | aa10fe35e811 |
| novocare.com-pharmacy.txt | 78583a2778ce |
| novonordisk.com-home.txt | 7885da01f43b |
| ozempic.com-savings.txt | fdf859a18c29 |
| pricinginfo.lilly.com-foundayo.txt | a724db0c8334 |
| pricinginfo.lilly.com-mounjaro.txt | 0eb6fcd1b9fc |
| pricinginfo.lilly.com-zepbound.txt | 0bf1443d2468 |
| trumprx.gov-p-foundayo.txt | 1fd57d354879 |
| trumprx.gov-p-ozempic-pill.txt | ac587c1186c4 |
| trumprx.gov-p-ozempic.txt | c1d5f9cdac71 |
| trumprx.gov-p-wegovy-pill.txt | 8a312b1bfc66 |
| trumprx.gov-p-wegovy.txt | 729411085203 |
| trumprx.gov-p-zepbound-kwikpen.txt | 921f00acc9a8 |
| trumprx.gov-p-zepbound.txt | 2f581002afbd |
| trumprx.gov-robots.txt | a8eaa370bd1d |
| wegovy.com-home.txt | 68e7c132c9fe |

The values above are the first 12 hex characters of each full digest. The full
digest is the first line of each file.

These fixtures are text extractions of the source pages, so they contain
third-party URLs quoted from those pages. They are research evidence, not
published links: no file under `public/` gained an outbound link to any host
outside the allowlist, which the integrity gate enforces.

## 6. What this pass changed

| Row | Before | After |
| --- | --- | --- |
| `zepbound\|any\|trumprx` | confirmed at 299, filed under "any" | replaced by three per-strength rows: 299 at 2.5 mg, 399 at 5 mg, 449 above |
| `zepbound\|2.5mg\|lillydirect_self_pay` | unverified | confirmed, 299 |
| `zepbound\|5mg\|lillydirect_self_pay` | unverified | confirmed, 399 |
| `zepbound\|all_other_doses\|lillydirect_self_pay` | conflicting | confirmed, 449, with the 45-day condition |
| `zepbound\|any\|medicare_bridge` | unverified | confirmed, 50 |
| `wegovy_injection\|any\|medicare_bridge` | unverified | confirmed, 50 |
| `wegovy_pill\|any\|medicare_bridge` | unverified | confirmed, 50 |
| `foundayo\|any\|medicare_bridge` | unverified | confirmed, 50 |
| `wegovy_injection\|standard_doses\|trumprx` | unverified | confirmed, 349 |
| `foundayo\|any\|trumprx` | unverified | confirmed, 149 |
| `foundayo\|any\|list_price` | unverified | confirmed, 649 |
| `mounjaro\|any\|list_price` | unverified | confirmed, 1112.16 |
| `zepbound\|any\|list_price` | conflicting | unverified, with the manufacturer's range in the notes |
| `ozempic\|any\|list_price` | conflicting | unchanged; the read is recorded |
| `mounjaro\|any\|lillydirect_self_pay` | unverified | unchanged; the read is recorded, and the figure is a bound |
| 8 other confirmed rows | confirmed at the same figure | re-confirmed, date moved to 2026-10-29, conditions replaced with the source's own |
| 3 list-price and 6 Part D rows | unverified or conflicting | unchanged in value; each candidate block records the read |
| 3 copay-card rows | unverified | unchanged in value; each candidate block records the read and the bound |
| 4 pending rules | pending | retired against verbatim quotes |
| 1 pending rule | pending | still pending; the read is recorded in its basis |
| 7 rows on pages still unread | unverified | unverified; each candidate block records the refusal and the method that would work |

## 7. Gate results

| Gate | Result |
| --- | --- |
| `npm test` | 121 passed, 0 failed |
| `node tools/build-pages.mjs` | exit 0 |
| `git diff --exit-code public/` | clean after the regenerated tree was committed |
| `node tools/qa.mjs` | exit 0, 28 of 28 checks passed |
| `node tools/contrast-audit.mjs` | exit 0 |
| `node tools/keyboard-audit.mjs` | exit 0 |

The browser gates need a Chromium binary. On this machine they run with
`CHROMIUM_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe`; without it
they exit non-zero with "No Chromium found", which is an environment problem and
not a result about the site.

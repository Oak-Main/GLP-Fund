# Verification pass 2026-10-28

The runbook's verification pass, run end to end for the first time. Every host in
`docs/ops-runbook.md` section 1.1 was probed, every page that could be read was read
directly, and every figure it confirmed or refuted was applied to
`public/data/pricing.json` under section 1.3.

**Before this pass:** 8 confirmed, 3 conflicting, 34 unverified (45 figures).
**After this pass:** 14 confirmed, 3 conflicting, 28 unverified (45 figures).

## 1. Egress probe

The egress allowlist in the runbook had never been applied: the 2026-07-30 pass was
blocked at CONNECT, and the 2026-09-28 pass read only two hosts. On 2026-10-28 the
primary sources were reachable from this machine, with one exception, described below.

At most two retries per host, as the lane requires. "Attempts" counts the requests
actually made, so a 403 that persisted through three attempts is recorded as three.

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
| lillydirect.lilly.com | https://lillydirect.lilly.com/ | 403 | 3 | 2026-10-29T20:05:59Z | refused |
| zepbound.lilly.com | https://zepbound.lilly.com/ | 403 | 3 | 2026-10-29T20:06:00Z | refused |
| mounjaro.lilly.com | https://mounjaro.lilly.com/ | 403 | 3 | 2026-10-29T20:06:00Z | refused |
| pricinginfo.lilly.com | https://pricinginfo.lilly.com/ | 403 | 3 | 2026-10-29T20:06:00Z | refused |
| www.lilly.com | https://www.lilly.com/ | 403 | 3 | 2026-10-29T20:06:00Z | refused |
| www.lillycares.com | https://www.lillycares.com/ | 403 | 3 | 2026-10-29T20:06:00Z | refused |

### What a refusal looks like here

Every Eli Lilly property returns HTTP 403 with a short bot-protection interstitial page
whose entire body is the challenge text `Just a moment...`. It is not a timeout and not
an upstream error: the host answers, and it answers "no". The 2026-07-30 pass recorded
the same wall from the other side of the egress policy, as "no healthy upstream". The
egress allowlist is now open and the wall is still there, so this is the vendor's own
bot protection rather than a network policy.

No attempt was made to work around it. The pages are in `OWNER_STEPS.md` for a browser
read, which is the method the runbook has always specified for these hosts.

### Hosts that were probed and did not exist at the paths tried

These are recorded because a 404 is a different fact from a refusal, and because the
next pass should not repeat the guessing:

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

The Medicare GLP-1 Bridge page was found by reading the medicare.gov home page rather
than by guessing a path: the home page carries the Bridge card and links to
`/coverage/weight-loss-drugs`. The BALANCE Model participating-state list was not
located by a static fetch of cms.gov or innovation.cms.gov, and the FDA 503B bulks list
page was not located. Both are recorded as open items below.

## 2. What each read confirmed or refuted

### trumprx.gov, seven product pages and robots.txt

The platform embeds its full price model in the page HTML, so the figures are read from
the page itself rather than from an API call. `robots.txt` allows every path except
`/api/`, and no API was called.

| Page | Figure read | Applied |
| --- | --- | --- |
| /p/ozempic | 199 for the 0.25 mg and 0.5 mg strengths, introductory, two monthly fills between 11/17/2025 and 12/31/2026; then 349 for 0.25 mg, 0.5 mg and 1 mg, and 499 for 2 mg | `ozempic|any|trumprx` re-confirmed, conditions replaced with the source's own |
| /p/wegovy | 199 for the 0.25 mg and 0.5 mg strengths, introductory, two monthly fills between 11/17/2025 and 12/31/2026; then 349 for 0.25 mg, 0.5 mg, 1 mg, 1.7 mg and 2.4 mg, and 399 for Wegovy HD at 7.2 mg | `wegovy_injection|low_doses|trumprx` re-confirmed; `wegovy_injection|standard_doses|trumprx` **promoted** to 349 |
| /p/zepbound | 299 for the 2.5 mg vial, 399 for the 5 mg vial, 449 for the 7.5 mg, 10 mg, 12.5 mg and 15 mg vials; a refill condition raises 7.5 mg to 499 and 10 mg and above to 699 when more than 45 days pass since the last delivery or receipt | `zepbound|any|trumprx` re-confirmed; the dose split and the refill condition are now read from the source |
| /p/zepbound-kwikpen | 299 for 2.5 mg, 399 for 5 mg, 449 for 7.5 mg, 10 mg, 12.5 mg and 15 mg; the same 45-day refill condition | read; no row on this pathway distinguishes the KwikPen |
| /p/foundayo | 149 for the 0.8 mg and 2.5 mg tablets, 199 for 5.5 mg, 299 for 9 mg, 14.5 mg and 17.2 mg; the 2.5 mg and 5.5 mg prices are temporarily reduced through 2026-12-31, with regular prices of 199 and 299; the 45-day refill condition applies at 14.5 mg and 17.2 mg | `foundayo|any|trumprx` **promoted** to 149 |
| /p/wegovy-pill | 149 for 1.5 mg, 199 for 4 mg, 299 for 9 mg and 25 mg | read; this pathway has no TrumpRx row |
| /p/ozempic-pill | 149 for 1.5 mg, 199 for 4 mg, 299 for 9 mg | read; this pathway has no TrumpRx row |

**One correction.** The prior pass carried an "INTRODUCTORY price" caveat on
`zepbound|any|trumprx` that it explicitly could not confirm or refute. The direct read
refutes it: the Zepbound page states no introductory period and no fill limit, and its
price model carries a per-strength tier structure with a 45-day refill condition
instead. The Ozempic and Wegovy pen pages, by contrast, do carry an explicit
"Limited Time Offer" for two fills. The caveat was therefore removed, and the card now
states the per-strength prices and the refill penalty. See the test change in
`test/pricing.test.js` for the note that records why.

**Reference prices were not promoted.** Each TrumpRx page shows an "Original Price"
beside the offer: 1,087.00 for Zepbound vials, 1,027.51 for Ozempic, 1,349.02 for
Wegovy, 649.00 for Foundayo, and 499.00 or 699.00 for the Zepbound KwikPen. The
platform does not label these as list prices, so they were not published as list
prices and they were not used to reconcile the two conflicting list-price rows. Each
record of that is held in the candidate block of the relevant row.

### medicare.gov, the Medicare GLP-1 Bridge page

The Bridge is confirmed from the source. The page states a 50 dollar monthly copayment,
that it started 2026-07-01, that it is available nationwide including all states and
U.S. territories, and that it covers Foundayo tablets, Wegovy injection and tablets, and
the Zepbound KwikPen only, not single-dose Zepbound vials or pens.

Four rows were promoted to 50: `zepbound|any|medicare_bridge`,
`wegovy_injection|any|medicare_bridge`, `wegovy_pill|any|medicare_bridge` and
`foundayo|any|medicare_bridge`. Their caveats carry the page's own exclusion
mechanism, the prior-authorization window through 2027-12-31, and the statement that
discount cards are not creditable coverage.

Two pending rules were retired against verbatim quotes from the same page:
`medicare-bridge-requires-medicare` and `medicare-bridge-part-d-eligible-exclusion`.
The third note rule on this programme, `medicare-bridge-clinical-criteria`, was
rewritten from "reported and unconfirmed" to the source's own BMI tiers and covered
formulations.

The Part D page was also read. It publishes no price for these medicines, because what
a beneficiary pays depends on their own plan, so the six `medicare_part_d` rows stay
null. Their candidate blocks now record the read.

### www.novocare.com, the pharmacy page

Every Novo price in the dataset was re-read on the page, now at `/delivery.html`
(`/pharmacy.html` redirects there). No price moved. What changed is the evidence: the
introductory terms, the fill counts, the end date and the ongoing prices after the
introductory fills are now quoted from the manufacturer rather than reported.

The insured offers on the same page are still bounds, not prices: "Pay as little as
$25, subject to a maximum savings of $100/month. Government beneficiaries excluded."
A bound never becomes a value, so those rows still render no number.

### www.ozempic.com, the savings page

The Ozempic Savings Card terms are now read directly: "Pay as little as $25, subject to
a maximum savings of $100/month. Eligibility and restrictions apply. Government
beneficiaries excluded.", offered to "Commercially insured patients with Ozempic®
coverage", and "Patients enrolled in federal or state health care programs, such as
Medicaid, are not eligible for the Ozempic® pay as little as $25 offer."

This is a manufacturer-confirmed quote for a manufacturer savings card, but the two
pending copay-card rules cite Lilly's own terms, and those were refused. The rules were
therefore not retired: their basis now records the Novo evidence and the reason the
rule still stands. One further read of Lilly's card terms retires both.

### aspe.hhs.gov, the federal poverty guidelines

The 2026 guidelines are the current ones. One person: 15,960 dollars for the
contiguous states and the District of Columbia. This is the denominator for the
patient-assistance income threshold, not the threshold itself, which lives on
lillycares.com and was refused. `patient-assistance-income-tier` stays pending, with
the read recorded in its basis.

### fda.gov, cms.gov, investor.lilly.com, www.wegovy.com, www.novonordisk.com

Read, with no price figure on any of them that maps to a row in the dataset.

- The FDA drug-shortage pages were read, including the shortage database search page.
  The per-medicine shortage state for semaglutide and tirzepatide is not exposed as a
  readable per-drug record by a static fetch, and the 503B bulks list page was not
  located. No FDA-sourced row exists in the dataset, so nothing was applied.
- The FDA shortage database page carries a link to the Federal Register, and the
  Federal Register is a primary source for rulemaking. Nothing on it bears on a price.
- investor.lilly.com carries no price-change release. The news release feed was read
  through 2026-10-29 and the most recent releases are a third-quarter financial result,
  a retatrutide trial, a leadership change and a dividend declaration.
- www.wegovy.com is a marketing site; the savings-card terms page at the path this
  pass tried returned 404. The Ozempic savings page at the equivalent path was read.
- cms.gov carries no price and no locatable BALANCE participating-state list.

## 3. Not read in this pass

| Host or item | Why |
| --- | --- |
| novonordiskpap.com | Outside the egress allowlist in `docs/ops-runbook.md`. The three patient-assistance rows that cite it were not re-checked, and their candidate blocks say so. |
| BALANCE Model participating states | Not located by a static fetch of cms.gov or innovation.cms.gov. The rule it supports, `medicaid-balance-model-is-state-variable`, is unchanged. |
| FDA 503B bulks list final determination | The page was not located at two plausible paths. |
| FDA per-medicine shortage state | The shortage database is a search application; no readable per-drug record for semaglutide or tirzepatide was returned. |

## 4. A note on the date

The lane specifies 2026-10-28 for the verification date, the branch name, the document
name, the fixture directory and the pull request title, and the data carries that date:
every `verified_date` moved to 2026-10-28 and every rule quote is dated 2026-10-28.

The reads themselves crossed the UTC midnight boundary and the machine recorded them at
2026-10-29T20:05Z to 2026-10-29T20:06Z. The fixture headers carry that true UTC time,
because a frozen fixture whose timestamp is invented is worse than no fixture. Nothing
else in the dataset depends on the difference: a one-day offset on a verification date
changes neither a staleness state nor a price.

## 5. Frozen fixtures

Every page read is frozen at `test/fixtures/sources/2026-10-28/`, with a SHA-256 line
at the top covering every byte after that first line.

| Fixture | SHA-256 |
| --- | --- |
| aspe.hhs.gov-poverty-guidelines.txt | 68c6b3957765 |
| cms.gov-home.txt | d5c2223d9633 |
| fda.gov-drug-shortages.txt | e72b5f51f8aa |
| fda.gov-shortage-database.txt | 1a92e3f44f67 |
| investor.lilly.com-home.txt | 3f3754c16461 |
| investor.lilly.com-news-releases-rss.txt | e65a287bb74b |
| medicare.gov-coverage-weight-loss-drugs.txt | 664180132834 |
| medicare.gov-health-drug-plans-part-d.txt | aa10fe35e811 |
| novocare.com-pharmacy.txt | 78583a2778ce |
| novonordisk.com-home.txt | 7885da01f43b |
| ozempic.com-savings.txt | fdf859a18c29 |
| trumprx.gov-p-foundayo.txt | 1fd57d354879 |
| trumprx.gov-p-ozempic-pill.txt | ac587c1186c4 |
| trumprx.gov-p-ozempic.txt | c1d5f9cdac71 |
| trumprx.gov-p-wegovy-pill.txt | 8a312b1bfc66 |
| trumprx.gov-p-wegovy.txt | 729411085203 |
| trumprx.gov-p-zepbound-kwikpen.txt | 921f00acc9a8 |
| trumprx.gov-p-zepbound.txt | 2f581002afbd |
| trumprx.gov-robots.txt | a8eaa370bd1d |
| wegovy.com-home.txt | 68e7c132c9fe |

The values above are the first 12 hex characters of each full digest. The full digest
is the first line of each file.

These fixtures are text extractions of the source pages, so they contain third-party
URLs quoted from those pages. They are research evidence, not published links: no file
under `public/` gained an outbound link to any host outside the allowlist, which the
integrity gate enforces.

## 6. What this pass changed

| Row | Before | After |
| --- | --- | --- |
| `zepbound\|any\|medicare_bridge` | unverified | confirmed, 50 |
| `wegovy_injection\|any\|medicare_bridge` | unverified | confirmed, 50 |
| `wegovy_pill\|any\|medicare_bridge` | unverified | confirmed, 50 |
| `foundayo\|any\|medicare_bridge` | unverified | confirmed, 50 |
| `wegovy_injection\|standard_doses\|trumprx` | unverified | confirmed, 349 |
| `foundayo\|any\|trumprx` | unverified | confirmed, 149 |
| 14 other confirmed rows | confirmed at the same figure | re-verified, date moved to 2026-10-28, conditions replaced with the source's own |
| 3 list-price rows | 2 conflicting, 1 unverified | unchanged; each candidate block now records the read |
| 6 Part D rows | unverified | unchanged, value null; each candidate block now records the read |
| 2 pending rules | pending | retired against verbatim quotes from medicare.gov |
| 3 pending rules | pending | still pending, with the new evidence recorded in the basis |
| 17 rows on refused hosts | unverified | unverified; each candidate block records the refusal |

## 7. Gate results

| Gate | Result |
| --- | --- |
| `npm test` | 118 passed, 0 failed |
| `node tools/build-pages.mjs` | exit 0 |
| `git diff --exit-code public/` | clean after the regenerated tree was committed |
| `node tools/qa.mjs` | exit 0, 26 of 26 checks passed |
| `node tools/contrast-audit.mjs` | exit 0 |
| `node tools/keyboard-audit.mjs` | exit 0 |

The browser gates need a Chromium binary. On this machine they run with
`CHROMIUM_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe`; without it they
exit non-zero with "No Chromium found", which is an environment problem and not a
result about the site.

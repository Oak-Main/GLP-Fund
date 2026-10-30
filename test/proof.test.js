/**
 * The proof gate.
 *
 * A published number is a claim about a page. This gate holds every confirmed
 * figure to the frozen evidence for the page it claims to come from: there
 * must be a fixture whose URL or Final-URL is the row's source_url, and the
 * figure must appear in it.
 *
 * It exists because the first verification pass could publish a price that no
 * fixture carried. The TrumpRx pages state their prices inside the page's
 * embedded payload, and the text extraction of those pages holds none of them,
 * so a row could cite a source it had never actually been read from. The
 * fixtures for those pages are now frozen as the raw HTML and as the decoded
 * payload, which is where the prices live.
 *
 * Rules of evidence, unchanged: only a primary source confirms. A search
 * result summarising a page is not a read of that page.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { rankPathways } from '../public/engine/pricing.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const FIXTURES = join(ROOT, 'test', 'fixtures', 'sources');
const PUBLIC = join(ROOT, 'public');
const SHIPPED = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'pricing.json'), 'utf8'));

/**
 * Sentences that describe a figure the site publishes as confirmed as being
 * reported, unreachable or unverified. They were true when the network
 * refused every primary source, and they are the kind of sentence a reader
 * cannot check: they assert the state of the world rather than our reading of
 * it. Once a figure is confirmed, the site must not say it is only reported.
 */
const STALE_CLAIMS = [
  'We currently publish no verified prices',
  'We cannot read the live platform',
  'We could not reach CMS',
  'shows no verified price for any medication',
  'has been widely reported',
];

/** The built pages. */
function builtPages() {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) out.push(full);
    }
  };
  walk(PUBLIC);
  return out;
}

/** The stale claims a text contains. */
function staleClaims(text) {
  return STALE_CLAIMS.filter((phrase) => text.includes(phrase));
}

/** Normalise a URL for comparison: lower-case host, no trailing slash. */
function normaliseUrl(value) {
  try {
    const u = new URL(value);
    const path = u.pathname.replace(/\/+$/, '');
    return `${u.host.toLowerCase()}${path}`;
  } catch {
    return String(value).trim().replace(/\/+$/, '').toLowerCase();
  }
}

/** Every fixture, with the URLs it claims to be. */
function loadFixtures() {
  const out = [];
  for (const dir of readdirSync(FIXTURES, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    for (const file of readdirSync(join(FIXTURES, dir.name))) {
      if (!file.endsWith('.txt')) continue;
      const text = readFileSync(join(FIXTURES, dir.name, file), 'utf8');
      const url = /^URL: (.+)$/m.exec(text)?.[1]?.trim();
      const finalUrl = /^Final-URL: (.+)$/m.exec(text)?.[1]?.trim();
      out.push({ name: `${dir.name}/${file}`, text, url, finalUrl });
    }
  }
  return out;
}

/**
 * The forms a figure may take in a frozen page. A source states a price in
 * dollars, and the TrumpRx payload states it in cents. Both are the same
 * number, so both are accepted; neither is accepted as a fragment of a longer
 * number, which is what stops "299" from matching inside "1,299" or "29900".
 */
function valueForms(value) {
  const forms = new Set([String(value)]);
  const grouped = value.toLocaleString('en-US');
  forms.add(grouped);
  if (Number.isInteger(value)) {
    forms.add(`${grouped}.00`);
    forms.add(String(value * 100));
  }
  return [...forms];
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Is this figure visible in this frozen page? */
function valueAppears(text, value) {
  for (const form of valueForms(value)) {
    // Not preceded by a digit, and not by the tail of a grouped number.
    // Not followed by a digit.
    const re = new RegExp(`(?<![0-9])(?<!\\d,)${escapeRe(form)}(?![0-9])`);
    if (re.test(text)) return true;
  }
  return false;
}

/** The fixtures that claim to be this source, by URL or Final-URL. */
function evidenceFor(fixtures, sourceUrl) {
  const key = normaliseUrl(sourceUrl);
  return fixtures.filter((f) => normaliseUrl(f.url) === key || normaliseUrl(f.finalUrl) === key);
}

/**
 * The prices a decoded payload fixture states for one strength.
 *
 * The platform keys a variant by dose and volume, for example "1.7/0.75" for
 * 1.7 mg in a 0.75 mL pen, and the key before the slash is the dose in mg.
 *
 * A strength can carry more than one price, and all of them are that
 * strength's price. "trxPrice" is what the platform charges now. Where the
 * platform runs a limited-time offer it also states the price after the offer
 * ends, in "tiered.regularDosePrice", which is the figure the 2027-01-01
 * branch publishes. A row may carry either, and the row's caveats say which.
 */
function payloadPrices(text) {
  const byDose = new Map();
  const add = (dose, price) => {
    if (!byDose.has(dose)) byDose.set(dose, new Set());
    byDose.get(dose).add(price);
  };
  // Split on the variant key, so each chunk is one variant's own data and
  // cannot reach into the next one.
  for (const chunk of text.split('"strength"').slice(1)) {
    const key = /^\s*:\s*"([^"]+)"/.exec(chunk)?.[1];
    if (!key) continue;
    const dose = key.split('/')[0];
    const window = chunk.slice(0, 600);
    const trx = /"trxPrice"\s*:\s*(\d+)/.exec(window);
    if (trx) add(dose, Number(trx[1]) / 100);
    const regular = /"regularDosePrice"\s*:\s*(\d+)/.exec(window);
    if (regular) add(dose, Number(regular[1]) / 100);
  }
  return byDose;
}

/** The strengths a dose tier covers, from the drug's own tier map. */
function strengthsForTier(drug, tier) {
  const meta = SHIPPED.drugs?.[drug];
  if (!meta || !meta.doseTiers) return [];
  return Object.entries(meta.doseTiers)
    .filter(([, t]) => t === tier)
    .map(([dose]) => dose.replace(/mg$/, ''));
}


/**
 * Every currency figure a caveat states, proved against the page the row was
 * read from. A figure that is not in the page is a sentence to cut, not a
 * sentence to rewrite in words.
 */
function caveatFigureOffenders(rows, find) {
  const offenders = [];
  for (const row of rows) {
    for (const caveat of row.caveats ?? []) {
      for (const match of String(caveat).matchAll(/\$([0-9][0-9,]*(?:\.\d+)?)/g)) {
        const figure = Number(match[1].replace(/,/g, ''));
        const evidence = find(row.source_url);
        if (!evidence.length) {
          offenders.push(`${row.drug}|${row.dose_or_tier}|${row.pathway}: "${match[0]}" but no fixture was frozen for ${row.source_url}`);
          continue;
        }
        if (!evidence.some((f) => f.text.includes(String(figure)) || f.text.includes(String(Math.round(figure * 100))))) {
          offenders.push(`${row.drug}|${row.dose_or_tier}|${row.pathway}: "${match[0]}" does not appear in the fixture for ${row.source_url}`);
        }
      }
    }
  }
  return offenders;
}

/** Does the text call anything "reported"? */
function saysReported(text) {
  return /reported/i.test(text);
}

const fixtures = loadFixtures();

test('every confirmed figure is visible in the frozen evidence for its source', () => {
  const confirmed = SHIPPED.prices.filter((p) => p.confidence === 'confirmed' && typeof p.value === 'number');
  assert.ok(confirmed.length > 0, 'there are confirmed figures to prove');

  const unproven = [];
  for (const row of confirmed) {
    const id = `${row.drug}|${row.dose_or_tier}|${row.pathway}`;
    const evidence = evidenceFor(fixtures, row.source_url);
    if (!evidence.length) {
      unproven.push(`${id} cites ${row.source_url}, and no fixture was frozen for that URL`);
      continue;
    }
    if (!evidence.some((f) => valueAppears(f.text, row.value))) {
      unproven.push(`${id} states ${row.value}, and that figure does not appear in any fixture for ${row.source_url}`);
    }
  }
  assert.deepEqual(unproven, [], 'Every published figure must be visible in the page it was read from.');
});

test('a dose tier is priced as the payload prices that dose', () => {
  // The presence check above proves the number is on the page. This proves it
  // is the number for THIS dose, which is the half that the original defect
  // turned on: a 2.5 mg figure offered to a 15 mg visitor.
  const checked = [];
  const wrong = [];

  for (const row of SHIPPED.prices) {
    if (row.confidence !== 'confirmed' || typeof row.value !== 'number') continue;
    if (row.dose_or_tier === 'any') continue;
    const strengths = strengthsForTier(row.drug, row.dose_or_tier);
    if (!strengths.length) continue;

    const evidence = evidenceFor(fixtures, row.source_url);
    const payloads = evidence.filter((f) => f.name.endsWith('-payload.txt'));
    if (!payloads.length) continue; // no decoded payload for this source

    const prices = payloadPrices(payloads.map((p) => p.text).join('\n'));
    if (!prices.size) continue;

    checked.push(`${row.drug}|${row.dose_or_tier}|${row.pathway}`);
    for (const strength of strengths) {
      const offered = prices.get(strength);
      if (!offered) {
        wrong.push(`${row.drug}|${row.dose_or_tier}|${row.pathway}: the payload does not state a price for ${strength} mg`);
      } else if (!offered.has(row.value)) {
        wrong.push(
          `${row.drug}|${row.dose_or_tier}|${row.pathway}: the payload prices ${strength} mg at ` +
            `${[...offered].join(' or ')}, not ${row.value}`
        );
      }
    }
  }

  assert.ok(checked.length > 0, 'at least one row is priced against a decoded payload');
  assert.deepEqual(wrong, [], 'A tier must carry the price the source gives that strength.');
});

test('the proof gate rejects a figure that is not in the evidence', () => {
  // The negative control. If this stops failing, the gate above is not
  // running and the two assertions before it are meaningless.
  const ozempic = SHIPPED.prices.find(
    (p) => p.drug === 'ozempic' && p.dose_or_tier === 'any' && p.pathway === 'trumprx'
  );
  assert.ok(ozempic, 'the Ozempic TrumpRx row exists');

  const evidence = evidenceFor(fixtures, ozempic.source_url);
  assert.ok(evidence.length > 0, 'the Ozempic TrumpRx page was frozen');

  assert.ok(valueAppears(evidence.map((f) => f.text).join('\n'), ozempic.value), 'the real figure is found');
  assert.ok(!valueAppears(evidence.map((f) => f.text).join('\n'), 1234), 'a figure that is not in the page is not found');
  assert.equal(evidenceFor(fixtures, 'https://trumprx.gov/p/not-a-real-page').length, 0, 'an unknown source has no evidence');
});

test('the built site does not tell a reader that a confirmed figure is unreported', () => {
  const confirmed = SHIPPED.prices.filter((p) => p.confidence === 'confirmed').length;
  if (!confirmed) return; // nothing is published, so the site may say so

  const hits = [];
  for (const file of builtPages()) {
    const text = readFileSync(file, 'utf8');
    for (const phrase of staleClaims(text)) {
      hits.push(`${relative(ROOT, file)}: "${phrase}"`);
    }
  }
  assert.deepEqual(hits, [], 'The site must not describe a figure it publishes as confirmed as reported or unverified.');
});

test('every currency figure in a caveat is visible in the page it was read from', () => {
  const offenders = caveatFigureOffenders(SHIPPED.prices, (url) => evidenceFor(fixtures, url));
  assert.deepEqual(offenders, [], 'A figure in a caveat must be visible in the page it came from.');
});

test('the caveat-figure guard rejects a figure that is not in the evidence', () => {
  // The negative control. A planted figure that the source never states must
  // be caught, or the gate above is not running.
  const planted = [{
    drug: 'test', dose_or_tier: 'any', pathway: 'test',
    source_url: 'https://www.novocare.com/pharmacy.html',
    caveats: ['The price is $123, which the page does not state.'],
  }];
  const offenders = caveatFigureOffenders(planted, (url) => evidenceFor(fixtures, url));
  assert.equal(offenders.length, 1);
  assert.match(offenders[0], /\$123/);
});

test('the Medicare Bridge page does not call a confirmed figure reported', () => {
  // The word must not appear anywhere on the page, including inside its
  // FAQPage JSON-LD, because that is what a search engine may quote.
  const page = readFileSync(join(PUBLIC, 'medicare-glp1-bridge', 'index.html'), 'utf8');
  assert.ok(!saysReported(page), 'The Bridge page still says a confirmed figure is reported.');
});

test('the reported-claim guard rejects a planted sentence', () => {
  // The negative control.
  assert.equal(saysReported('<p>This program is reported to provide a fixed cost.</p>'), true);
  assert.equal(saysReported('<p>Medicare states that the program covers certain drugs.</p>'), false);
});

test('a starting price says so wherever it is rendered', () => {
  const row = SHIPPED.prices.find((p) => p.drug === 'mounjaro' && p.pathway === 'lillydirect_self_pay');
  assert.ok(row, 'the Mounjaro self-pay row exists');
  assert.equal(row.startingPrice, true, 'the Mounjaro figure is a starting price');

  // The card.
  const results = rankPathways({ drug: 'mounjaro', dose: 'any', insurance: 'none' }, SHIPPED, '2026-10-29');
  const mounjaro = results.find((r) => r.pathway === 'lillydirect_self_pay');
  assert.ok(mounjaro, 'the LillyDirect pathway is offered');
  assert.match(mounjaro.displayCost, /^From \$499/);
  assert.match(mounjaro.displayAnnualCost, /^From \$5,988/);

  // The table and the body copy on the built pages.
  const methodology = readFileSync(join(PUBLIC, 'methodology', 'index.html'), 'utf8');
  assert.ok(methodology.includes('From $499'), 'the price table says From');
  const drugPage = readFileSync(join(PUBLIC, 'mounjaro-cost', 'index.html'), 'utf8');
  assert.ok(drugPage.includes('From $499'), 'the body copy says From');

  // And a price that is not a starting price is unchanged.
  const ozempic = results.find((r) => r.pathway === 'novocare_self_pay');
  if (ozempic) assert.doesNotMatch(ozempic.displayCost, /^From /);
});

test('the stale-copy guard rejects a planted sentence', () => {
  // The negative control. If this stops failing, the guard above is not
  // running and the pages could say anything.
  const planted = '<p>We currently publish no verified prices at all.</p>';
  const hits = staleClaims(planted);
  assert.equal(hits.length, 1);
  assert.match(hits[0], /no verified prices/);

  const clean = '<p>Twenty-one of forty-seven figures are confirmed against a primary source.</p>';
  assert.deepEqual(staleClaims(clean), []);
});

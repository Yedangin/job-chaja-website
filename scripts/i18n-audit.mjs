import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const appRoot = path.join(projectRoot, 'src', 'app');
const catalogRoot = path.join(projectRoot, 'messages', 'catalogs');
const locales = ['ko', 'en', 'vi', 'th', 'fil'];
const extensions = new Set(['.ts', '.tsx']);
const excludedSegments = [
  '/diagnosis/designs/',
  '/job-cards/designs/',
  '/variants/',
];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function relative(file) {
  return path.relative(projectRoot, file).replaceAll('\\', '/');
}

function isExcluded(file) {
  const normalized = `/${relative(file)}/`;
  return excludedSegments.some((segment) => normalized.includes(segment));
}

function isLaunchSource(file) {
  if (!extensions.has(path.extname(file)) || isExcluded(file)) return false;
  const normalized = relative(file);
  if (!normalized.startsWith('src/app/')) return false;
  if (normalized.includes('/api/')) return false;
  return true;
}

function flattenKeys(value, prefix = '', result = []) {
  for (const [key, child] of Object.entries(value)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      flattenKeys(child, next, result);
    } else {
      result.push(next);
    }
  }
  return result;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function auditCatalogs() {
  const result = { referenceKeys: [], locales: {}, valid: true, errors: [] };

  try {
    const parsed = Object.fromEntries(
      locales.map((locale) => [locale, readJson(path.join(catalogRoot, `${locale}.json`))]),
    );
    const referenceKeys = flattenKeys(parsed.en).sort();
    result.referenceKeys = referenceKeys;

    for (const locale of locales) {
      const keys = flattenKeys(parsed[locale]).sort();
      const missing = referenceKeys.filter((key) => !keys.includes(key));
      const extra = keys.filter((key) => !referenceKeys.includes(key));
      result.locales[locale] = { keyCount: keys.length, missing, extra };
      if (missing.length || extra.length) result.valid = false;
    }

    const legacyEnglish = flattenKeys(readJson(path.join(projectRoot, 'messages', 'en.json')));
    const legacyKorean = flattenKeys(readJson(path.join(projectRoot, 'messages', 'kr.json')));
    result.legacy = {
      enCount: legacyEnglish.length,
      krCount: legacyKorean.length,
      enOnly: legacyEnglish.filter((key) => !legacyKorean.includes(key)),
      krOnly: legacyKorean.filter((key) => !legacyEnglish.includes(key)),
    };
  } catch (error) {
    result.valid = false;
    result.errors.push(error instanceof Error ? error.message : String(error));
  }

  return result;
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
    .replace(/^\s*\/\/.*$/gm, '');
}

function candidateStrings(line) {
  const values = [];
  const quoted = /(['"`])([^'"`]{4,}?)\1/g;
  const jsxText = />([^<>{}]{3,})</g;

  for (const match of line.matchAll(quoted)) values.push(match[2]);
  for (const match of line.matchAll(jsxText)) values.push(match[1]);
  return values.map((value) => value.trim()).filter(Boolean);
}

function isEnglishCopyCandidate(value) {
  if ((value.match(/[A-Za-z]{2,}/g) ?? []).length < 2) return false;
  if (/^(https?:|\/|@\/|\.\/|\.\.\/|[A-Z0-9_:-]+$)/.test(value)) return false;
  if (/^(flex|grid|block|inline|hidden|relative|absolute|fixed|sticky)\b/.test(value)) return false;
  if (/\b(px-|py-|mx-|my-|text-|bg-|border-|rounded-|hover:|focus:|sm:|md:|lg:)/.test(value)) return false;
  if (/^(GET|POST|PUT|PATCH|DELETE)\b/.test(value)) return false;
  return true;
}

function routeGroup(file) {
  const normalized = relative(file);
  if (normalized.includes('/admin/')) return 'admin';
  if (normalized.includes('/company/')) return 'company';
  if (normalized.includes('/worker/')) return 'worker';
  if (normalized.includes('/board/')) return 'board';
  if (normalized.includes('/diagnosis/') || normalized.includes('/international/')) return 'planner';
  return 'public';
}

function auditSourceFile(file) {
  const source = stripComments(fs.readFileSync(file, 'utf8'));
  const lines = source.split(/\r?\n/);
  const findings = {
    file: relative(file),
    group: routeGroup(file),
    korean: [],
    english: [],
    fixedKoLocale: [],
    riskMarkers: [],
  };

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    if (!trimmed || /^(import|export\s+type|type\s|interface\s)/.test(trimmed)) return;

    const strings = candidateStrings(line);
    if (strings.some((value) => /[\uAC00-\uD7A3]/.test(value))) {
      findings.korean.push({
        line: lineNumber,
        sample: strings.find((value) => /[\uAC00-\uD7A3]/.test(value)),
      });
    }

    const english = strings.find(isEnglishCopyCandidate);
    if (english) findings.english.push({ line: lineNumber, sample: english });

    if (line.includes('ko-KR')) {
      findings.fixedKoLocale.push({ line: lineNumber, sample: 'ko-KR' });
    }

    const marker = line.match(/\b(MOCK|DUMMY|TODO)\b|fallback|coming\s+soon/iu);
    if (marker) findings.riskMarkers.push({ line: lineNumber, sample: marker[0] });
  });

  return findings;
}

function summarizeSources(findings) {
  const groups = {};
  const totals = { files: findings.length, korean: 0, english: 0, fixedKoLocale: 0, riskMarkers: 0 };

  for (const finding of findings) {
    groups[finding.group] ??= { files: 0, affectedFiles: 0, korean: 0, english: 0, fixedKoLocale: 0, riskMarkers: 0 };
    const group = groups[finding.group];
    group.files += 1;

    const affected = finding.korean.length
      + finding.english.length
      + finding.fixedKoLocale.length
      + finding.riskMarkers.length > 0;
    if (affected) group.affectedFiles += 1;

    for (const key of ['korean', 'english', 'fixedKoLocale', 'riskMarkers']) {
      group[key] += finding[key].length;
      totals[key] += finding[key].length;
    }
  }

  const remainingFiles = findings
    .map((finding) => ({
      file: finding.file,
      group: finding.group,
      korean: finding.korean.length,
      english: finding.english.length,
      fixedKoLocale: finding.fixedKoLocale.length,
      riskMarkers: finding.riskMarkers.length,
      score: finding.korean.length
        + finding.english.length
        + finding.fixedKoLocale.length * 5
        + finding.riskMarkers.length * 3,
    }))
    .filter((finding) => finding.score > 0)
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));

  totals.affectedFiles = remainingFiles.length;
  return { groups, totals, remainingFiles };
}

function printHuman(result) {
  console.log('JobChaja i18n launch audit');
  console.log(`Catalog parity: ${result.catalogs.valid ? 'PASS' : 'FAIL'} (${result.catalogs.referenceKeys.length} canonical keys)`);
  for (const locale of locales) {
    const item = result.catalogs.locales[locale];
    if (!item) continue;
    console.log(`  ${locale}: ${item.keyCount} keys, missing ${item.missing.length}, extra ${item.extra.length}`);
  }

  console.log(`Launch source files: ${result.sources.totals.files}`);
  console.log(`Affected files: ${result.sources.totals.affectedFiles}`);
  console.log(
    `Candidates: Korean ${result.sources.totals.korean}, English ${result.sources.totals.english}, fixed ko-KR ${result.sources.totals.fixedKoLocale}, risk markers ${result.sources.totals.riskMarkers}`,
  );

  console.log('Route groups:');
  for (const [group, item] of Object.entries(result.sources.groups).sort()) {
    console.log(
      `  ${group}: ${item.affectedFiles}/${item.files} files; ko ${item.korean}, en ${item.english}, ko-KR ${item.fixedKoLocale}, risk ${item.riskMarkers}`,
    );
  }

  console.log('Highest-priority remaining files:');
  for (const item of result.sources.remainingFiles.slice(0, 20)) {
    console.log(
      `  ${item.file}: ko ${item.korean}, en ${item.english}, ko-KR ${item.fixedKoLocale}, risk ${item.riskMarkers}`,
    );
  }

  if (result.catalogs.legacy) {
    console.log(
      `Legacy catalogs: en ${result.catalogs.legacy.enCount}, kr ${result.catalogs.legacy.krCount}, en-only ${result.catalogs.legacy.enOnly.length}, kr-only ${result.catalogs.legacy.krOnly.length}`,
    );
  }
  console.log(`Exit code: ${result.exitCode}`);
}

const catalogs = auditCatalogs();
const sourceFindings = walk(appRoot).filter(isLaunchSource).map(auditSourceFile);
const sources = summarizeSources(sourceFindings);
const hasSourceFindings = sources.totals.affectedFiles > 0;
const exitCode = catalogs.errors.length ? 2 : catalogs.valid && !hasSourceFindings ? 0 : 1;
const result = {
  generatedAt: new Date().toISOString(),
  exclusions: excludedSegments,
  catalogs,
  sources,
  exitCode,
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else {
  printHuman(result);
}

process.exitCode = exitCode;

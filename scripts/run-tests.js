require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const resultsDir = path.join(
  process.cwd(),
  'reports',
  'allure-results'
);

const reportDir = path.join(
  process.cwd(),
  'reports',
  'allure-report'
);

const runtimeDirs = [
  path.join(process.cwd(), 'test-results'),
  path.join(process.cwd(), '.cache'),
  path.join(process.cwd(), 'playwright-report'),
  path.join(process.cwd(), 'blob-report'),
];

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, {
      recursive: true,
      force: true,
    });
  }
}

function commandFor(command) {
  if (process.platform !== 'win32') {
    return command;
  }

  return command === 'npx' || command === 'allure'
    ? `${command}.cmd`
    : command;
}

function run(command, args) {
  return spawnSync(commandFor(command), args, {
    stdio: 'inherit',
    shell: false,
  });
}

function runQuiet(command, args) {
  return spawnSync(commandFor(command), args, {
    encoding: 'utf8',
    shell: false,
  });
}

function generateAllureReport() {
  if (!fs.existsSync(resultsDir)) {
    console.warn(
      'No Allure results found. Report generation skipped.'
    );
    return;
  }

  removeDir(reportDir);

  const result = runQuiet('allure', [
    'generate',
    resultsDir,
    '--clean',
    '-o',
    reportDir,
  ]);

  if (result.status !== 0) {
    console.warn('Allure report generation failed.');
    console.warn(result.stderr || result.stdout);
    return;
  }
}

for (const dir of runtimeDirs) {
  removeDir(dir);
}

const playwright = run(
  'npx',
  ['playwright', 'test', ...process.argv.slice(2)]
);

generateAllureReport();

process.exit(playwright.status || 0);
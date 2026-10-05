import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkDeploymentTargets, projectPath, podfilePath } from './check-ios-deployment-target.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const project = readFileSync(resolve(root, projectPath), 'utf8');
const podfile = readFileSync(resolve(root, podfilePath), 'utf8');
// Use the actual project's structure, but fix fixture versions independently of
// the current support floor so future intentional version changes remain testable.
const aligned = project.replace(/IPHONEOS_DEPLOYMENT_TARGET = [^;]+;/g, 'IPHONEOS_DEPLOYMENT_TARGET = 15.0;');
const pods = podfile.replace(/^platform\s+:ios.*$/m, "platform :ios, '15.0'");
const ids = ['504EC3141FED79650016851F', '504EC3151FED79650016851F',
  '504EC3171FED79650016851F', '504EC3181FED79650016851F'];
const labels = ['Project Debug', 'Project Release', 'App target "App" Debug', 'App target "App" Release'];

function changeConfig(id, replacement) {
  const start = aligned.indexOf(`${id} /*`);
  const setting = aligned.indexOf('IPHONEOS_DEPLOYMENT_TARGET = 15.0;', start);
  assert.ok(start >= 0 && setting >= 0);
  return aligned.slice(0, setting) + replacement +
    aligned.slice(setting + 'IPHONEOS_DEPLOYMENT_TARGET = 15.0;'.length);
}

test('repository deployment targets are aligned', () => {
  assert.equal(checkDeploymentTargets(project, podfile).checked.length, 4);
});

test('aligned settings pass and equivalent numeric versions compare equally', () => {
  assert.equal(checkDeploymentTargets(aligned, pods).minimum, '15.0');
  assert.equal(checkDeploymentTargets(aligned.replaceAll('= 15.0;', '= "15.0.0";'), pods).checked.length, 4);
});

for (const [index, id] of ids.entries()) {
  test(`${labels[index]} mismatch fails with the exact configuration and values`, () => {
    assert.throws(() => checkDeploymentTargets(changeConfig(id, 'IPHONEOS_DEPLOYMENT_TARGET = 14.0;'), pods),
      error => error.message.includes(labels[index]) &&
        error.message.includes('14.0') && error.message.includes('Podfile platform = 15.0'));
  });
}

test('a changed Podfile platform fails even when Xcode settings agree with each other', () => {
  assert.throws(() => checkDeploymentTargets(aligned, pods.replace("'15.0'", "'16.0'")), /Podfile platform = 16.0/);
});

test('missing or nonliteral deployment targets fail closed', () => {
  assert.throws(() => checkDeploymentTargets(changeConfig(ids[2], ''), pods), /missing explicit deployment target/);
  assert.throws(() => checkDeploymentTargets(changeConfig(ids[3], 'IPHONEOS_DEPLOYMENT_TARGET = "$(inherited)";'), pods),
    /expected an explicit numeric iOS version/);
});

test('conditional deployment target overrides are checked', () => {
  assert.throws(() => checkDeploymentTargets(changeConfig(ids[3],
    'IPHONEOS_DEPLOYMENT_TARGET = 15.0;\n"IPHONEOS_DEPLOYMENT_TARGET[sdk=iphoneos*]" = 14.0;'), pods),
  /IPHONEOS_DEPLOYMENT_TARGET\[sdk=iphoneos\*\] = 14.0/);
});

test('comments do not count as deployment targets or platform declarations', () => {
  assert.equal(checkDeploymentTargets(
    `// IPHONEOS_DEPLOYMENT_TARGET = 14.0;\n${aligned}`,
    `# platform :ios, '14.0'\n${pods}`).checked.length, 4);
});

test('missing, dynamic or multiple Podfile platforms fail closed', () => {
  for (const declaration of ['', 'platform :ios, minimum_ios_version',
    "platform :ios, '15.0'\nplatform :ios, '14.0'"]) {
    assert.throws(() => checkDeploymentTargets(aligned, declaration), /exactly one literal platform/);
  }
});

test('missing configurations and malformed projects cannot silently pass', () => {
  assert.throws(() => checkDeploymentTargets(aligned.replace('name = Debug;', 'name = Renamed;'), pods),
    /Project Debug: expected exactly one build configuration/);
  assert.throws(() => checkDeploymentTargets('', pods), /Invalid Xcode project/);
  assert.throws(() => checkDeploymentTargets(aligned.slice(0, -3), pods), /Invalid Xcode project/);
});

test('CLI returns success for aligned files and actionable failure for mismatched or missing files', () => {
  const directory = mkdtempSync(resolve(tmpdir(), 'ios-minimum-check-'));
  const cli = resolve(root, 'scripts/check-ios-deployment-target.mjs');
  const run = () => spawnSync(process.execPath, [cli], { cwd: directory, encoding: 'utf8' });
  try {
    for (const [path, content] of [[projectPath, aligned], [podfilePath, pods]]) {
      mkdirSync(dirname(resolve(directory, path)), { recursive: true });
      writeFileSync(resolve(directory, path), content);
    }
    assert.equal(run().status, 0);
    writeFileSync(resolve(directory, projectPath), changeConfig(ids[3], 'IPHONEOS_DEPLOYMENT_TARGET = 14.0;'));
    const failed = run();
    assert.equal(failed.status, 1);
    assert.match(failed.stderr, /App target "App" Release/);
    assert.match(failed.stderr, /Then rerun npm run check:ios/);
    assert.ok(failed.stderr.includes(projectPath) && failed.stderr.includes(podfilePath));
    rmSync(resolve(directory, podfilePath));
    assert.equal(run().status, 1);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('Codemagic gates native compilation with the check and regression tests', () => {
  const yaml = readFileSync(resolve(root, 'codemagic.yaml'), 'utf8').split('  android-build:')[0];
  assert.ok(yaml.indexOf('npm run check:ios') > yaml.indexOf('npx cap sync ios'));
  assert.ok(yaml.indexOf('npm run check:ios') < yaml.indexOf('xcode-project build-ipa'));
  assert.match(yaml, /set -e\n\s+npm run test:ios-minimum\n\s+npm run check:ios/);
});

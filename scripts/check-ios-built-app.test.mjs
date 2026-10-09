import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkBuiltAppMinimum } from './check-ios-built-app.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const pods = "platform :ios, '15.0'\n";
const fixture = name => readFileSync(resolve(root, `scripts/fixtures/ios-archive/${name}-Info.plist`), 'utf8');

function withArchive(callback) {
  const directory = mkdtempSync(resolve(tmpdir(), 'ios-built-check-'));
  mkdirSync(resolve(directory, 'ios/App'), { recursive: true });
  mkdirSync(resolve(directory, 'build/ios/ipa'), { recursive: true });
  writeFileSync(resolve(directory, 'ios/App/Podfile'), pods);
  const makeIpa = (xml, { binary = false, name = 'App.ipa', mainApps = 1 } = {}) => {
    execFileSync('python3', ['-c', `
import json, plistlib, sys, zipfile
data = json.load(sys.stdin)
with zipfile.ZipFile(sys.argv[1], 'w') as archive:
    content = plistlib.dumps(plistlib.loads(data['xml'].encode()), fmt=plistlib.FMT_BINARY) if data['binary'] else data['xml'].encode()
    for index in range(data['mainApps']):
        archive.writestr(f'Payload/App{index}.app/Info.plist', content)
    archive.writestr('Payload/App0.app/Frameworks/Dependency.framework/Info.plist', plistlib.dumps({'MinimumOSVersion': '99.0'}))
    archive.writestr('Payload/App0.app/PlugIns/Widget.appex/Info.plist', plistlib.dumps({'MinimumOSVersion': '99.0'}))
`, resolve(directory, 'build/ios/ipa', name)], {
      input: JSON.stringify({ xml, binary, mainApps }), encoding: 'utf8',
    });
  };
  const run = () => spawnSync(process.execPath, [resolve(root, 'scripts/check-ios-built-app.mjs')],
    { cwd: directory, encoding: 'utf8' });
  try {
    callback({ directory, makeIpa, run });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

for (const binary of [false, true]) {
  test(`matching archived ${binary ? 'binary' : 'XML'} Info.plist passes; nested bundles are ignored`, () => {
    withArchive(({ makeIpa, run }) => {
      makeIpa(fixture('matching'), { binary });
      const result = run();
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, new RegExp(`Info.plist format: ${binary ? 'binary' : 'XML'}; MinimumOSVersion: 15.0`));
      assert.match(result.stdout, /MinimumOSVersion agrees with Podfile \(15.0\)/);
    });
  });

  test(`mismatched archived ${binary ? 'binary' : 'XML'} Info.plist blocks publishing with both versions`, () => {
    withArchive(({ makeIpa, run }) => {
      makeIpa(fixture('mismatched'), { binary });
      const result = run();
      assert.equal(result.status, 1);
      assert.match(result.stdout, new RegExp(`Info.plist format: ${binary ? 'binary' : 'XML'}; MinimumOSVersion: 16.0`));
      assert.match(result.stderr, /App\.ipa: Payload\/App0\.app\/Info\.plist MinimumOSVersion = 16.0; Podfile platform = 15.0/);
      assert.match(result.stderr, /Do not publish this IPA/);
    });
  });
}

test('numeric equivalence passes; lower, missing and invalid versions fail closed', () => {
  assert.equal(checkBuiltAppMinimum('15.0.0', pods, 'App'), '15.0');
  assert.throws(() => checkBuiltAppMinimum('14.0', pods, 'App'), /Podfile platform = 15.0/);
  for (const value of [undefined, null, 15, '$(inherited)', '15.x']) {
    assert.throws(() => checkBuiltAppMinimum(value, pods, 'App'), /explicit numeric iOS version/);
  }
  assert.throws(() => checkBuiltAppMinimum('15.0', "platform :ios, minimum", 'App'), /literal platform/);
});

test('a second mismatched IPA cannot be silently published', () => {
  withArchive(({ makeIpa, run }) => {
    makeIpa(fixture('matching'));
    makeIpa(fixture('mismatched'), { name: 'Other.ipa' });
    assert.equal(run().status, 1);
  });
});

test('absent, corrupt and ambiguous app metadata block publishing', () => {
  withArchive(({ directory, makeIpa, run }) => {
    assert.equal(run().status, 1);
    writeFileSync(resolve(directory, 'build/ios/ipa/App.ipa'), 'not a zip');
    assert.equal(run().status, 1);
    for (const mainApps of [0, 2]) {
      makeIpa(fixture('matching'), { mainApps });
      assert.match(run().stderr, /exactly one Payload\/\*\.app\/Info\.plist/);
    }
    makeIpa('not a plist');
    assert.equal(run().status, 1);
    makeIpa(fixture('matching').replace(/<key>MinimumOSVersion<\/key>\s*<string>15\.0<\/string>/, ''));
    assert.match(run().stderr, /explicit numeric iOS version/);
    makeIpa(fixture('matching'));
    rmSync(resolve(directory, 'ios/App/Podfile'));
    assert.equal(run().status, 1);
  });
});

test('Codemagic checks the exported IPA after building and before TestFlight publishing', () => {
  const yaml = readFileSync(resolve(root, 'codemagic.yaml'), 'utf8').split('  android-build:')[0];
  const check = yaml.indexOf('npm run check:ios-built');
  assert.ok(check > yaml.indexOf('xcode-project build-ipa'));
  assert.ok(check < yaml.indexOf('    publishing:'));
  assert.match(yaml, /Verify exported app minimum iOS version\n\s+script: \|\n\s+set -e\n\s+npm run check:ios-built/);
  assert.match(yaml, /submit_to_testflight: true/);
});

test('the deliberate build-time override is isolated in a manual, non-publishing workflow', () => {
  const yaml = readFileSync(resolve(root, 'codemagic.yaml'), 'utf8');
  const normal = yaml.split('  ios-minimum-mismatch-test:')[0];
  const negative = yaml.split('  ios-minimum-mismatch-test:')[1].split('  android-build:')[0];
  assert.doesNotMatch(normal, /IPHONEOS_DEPLOYMENT_TARGET=16\.0/);
  assert.match(negative, /environment: \*ios_environment/);
  assert.match(negative, /- \*ios_verify_settings/);
  assert.match(negative, /--archive-xcargs "COMPILER_INDEX_STORE_ENABLE=NO IPHONEOS_DEPLOYMENT_TARGET=16\.0"/);
  assert.ok(negative.indexOf('- *ios_verify_export') > negative.indexOf('xcode-project build-ipa'));
  assert.doesNotMatch(negative, /^\s*(publishing|triggering|ignore_failure):/m);
});

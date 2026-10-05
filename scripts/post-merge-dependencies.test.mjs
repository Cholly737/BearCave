import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { dependencyConfigurationChanged, needsDependencyInstall } from './post-merge-dependencies.mjs';

test('adding check commands or changing app version does not require reinstalling', () => {
  const previous = { version: '1.0.0', dependencies: { react: '^18' }, scripts: { check: 'tsc' } };
  const current = { ...previous, version: '1.1.0', scripts: { ...previous.scripts, 'check:ios': 'node check.mjs' } };
  assert.equal(dependencyConfigurationChanged(previous, current), false);
});

test('dependency configuration changes require reinstalling', () => {
  for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'overrides']) {
    assert.equal(dependencyConfigurationChanged({ [field]: { a: '1' } }, { [field]: { a: '2' } }), true, field);
  }
  assert.equal(dependencyConfigurationChanged({ engines: { node: '>=18' } }, { engines: { node: '>=20' } }), true);
});

test('lifecycle changes require reinstalling', () => {
  assert.equal(dependencyConfigurationChanged({}, { scripts: { postinstall: 'node install.mjs' } }), true);
});

test('object ordering does not trigger a reinstall', () => {
  assert.equal(dependencyConfigurationChanged(
    { dependencies: { a: '1', b: '2' }, overrides: { a: { c: '3', d: '4' } } },
    { overrides: { a: { d: '4', c: '3' } }, dependencies: { b: '2', a: '1' } },
  ), false);
});

test('merge inspection skips script-only changes but detects lock repairs and missing tools', () => {
  const root = mkdtempSync(join(tmpdir(), 'bearcave-post-merge-'));
  const git = (...args) => execFileSync('git', args, { cwd: root, stdio: 'pipe' });
  try {
    git('init');
    git('config', 'user.name', 'Setup test');
    git('config', 'user.email', 'setup-test@example.invalid');
    const manifest = { dependencies: { a: '1' }, scripts: { check: 'tsc' } };
    writeFileSync(join(root, 'package.json'), JSON.stringify(manifest));
    writeFileSync(join(root, 'package-lock.json'), '{}');
    git('add', '.');
    git('commit', '-m', 'Initial fixture');
    writeFileSync(join(root, 'package.json'), JSON.stringify({
      ...manifest, scripts: { ...manifest.scripts, 'check:ios': 'node check.mjs' },
    }));
    git('add', 'package.json');
    git('commit', '-m', 'Script-only fixture merge');
    mkdirSync(join(root, 'node_modules/.bin'), { recursive: true });
    for (const tool of ['tsx', 'tsc', 'vite', 'esbuild', 'cap']) {
      writeFileSync(join(root, 'node_modules/.bin', tool), '');
    }
    assert.equal(needsDependencyInstall(root), false);
    writeFileSync(join(root, 'package-lock.json'), '{"changed":true}');
    assert.equal(needsDependencyInstall(root), true);
    writeFileSync(join(root, 'package-lock.json'), '{}');
    rmSync(join(root, 'node_modules/.bin/tsx'));
    assert.equal(needsDependencyInstall(root), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

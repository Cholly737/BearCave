import { existsSync, readFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const installFields = [
  'dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies',
  'peerDependenciesMeta', 'overrides', 'workspaces', 'engines', 'packageManager',
  'bundledDependencies', 'bundleDependencies', 'os', 'cpu', 'libc', 'installConfig',
];
const lifecycleScripts = ['preinstall', 'install', 'postinstall', 'prepare'];

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  }
  return value;
}

function installConfiguration(manifest) {
  return canonical({
    ...Object.fromEntries(installFields.map(field => [field, manifest[field] ?? null])),
    lifecycle: Object.fromEntries(lifecycleScripts.map(name => [name, manifest.scripts?.[name] ?? null])),
  });
}

export function dependencyConfigurationChanged(previous, current) {
  return JSON.stringify(installConfiguration(previous)) !== JSON.stringify(installConfiguration(current));
}

export function needsDependencyInstall(root = process.cwd()) {
  // A failed earlier install must not be mistaken for a ready environment.
  const tools = ['tsx', 'tsc', 'vite', 'esbuild', 'cap'];
  if (tools.some(tool => !existsSync(resolve(root, 'node_modules/.bin', tool)))) return true;

  const previous = JSON.parse(execFileSync('git', ['show', 'HEAD^1:package.json'], {
    cwd: root, encoding: 'utf8',
  }));
  const current = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  if (dependencyConfigurationChanged(previous, current)) return true;

  // Include working-tree repairs as well as the merged commit.
  const lockDiff = spawnSync('git', [
    'diff', '--quiet', 'HEAD^1', '--', 'package-lock.json', 'npm-shrinkwrap.json', '.npmrc',
  ], { cwd: root, encoding: 'utf8' });
  if (lockDiff.error) throw lockDiff.error;
  if (lockDiff.status !== 0 && lockDiff.status !== 1) {
    throw new Error(lockDiff.stderr || 'Unable to check npm lockfile changes.');
  }
  return lockDiff.status === 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(needsDependencyInstall() ? 'install' : 'ready');
  } catch (error) {
    console.error(`Cannot determine post-merge dependency setup: ${error.message}`);
    process.exitCode = 1;
  }
}

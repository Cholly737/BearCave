import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectPath = 'ios/App/App.xcodeproj/project.pbxproj';
export const podfilePath = 'ios/App/Podfile';

// Read the OpenStep property-list format without requiring Xcode or npm packages.
// Tokenize comments and quoted strings separately so nested settings and comments
// cannot be mistaken for build configurations.
function parseProject(text) {
  const tokens = text.match(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|[{}()=;,]|[^\s{}()=;,"]+/g)
    ?.filter(token => !token.startsWith('/*') && !token.startsWith('//')) ?? [];
  let index = 0;
  function expect(token) {
    if (tokens[index++] !== token) throw new Error(`Invalid Xcode project: expected ${token}.`);
  }
  function value() {
    const token = tokens[index++];
    if (token === '{') {
      const result = Object.create(null);
      while (tokens[index] !== '}') {
        if (index >= tokens.length) throw new Error('Invalid Xcode project: unclosed dictionary.');
        const key = value();
        if (typeof key !== 'string') throw new Error('Invalid Xcode project: invalid key.');
        if (Object.hasOwn(result, key)) throw new Error(`Duplicate Xcode setting: ${key}.`);
        expect('=');
        result[key] = value();
        expect(';');
      }
      expect('}');
      return result;
    }
    if (token === '(') {
      const result = [];
      while (tokens[index] !== ')') {
        if (index >= tokens.length) throw new Error('Invalid Xcode project: unclosed array.');
        result.push(value());
        if (tokens[index] !== ')') expect(',');
      }
      expect(')');
      return result;
    }
    if (!token || /^[{}()=;,]$/.test(token)) throw new Error('Invalid Xcode project: missing value.');
    return token.startsWith('"') ? token.slice(1, -1).replace(/\\(.)/g, '$1') : token;
  }
  const result = value();
  if (index !== tokens.length) throw new Error('Invalid Xcode project: trailing content.');
  return result;
}

function version(value, label) {
  if (typeof value !== 'string' || !/^\d+(?:\.\d+){0,2}$/.test(value)) {
    throw new Error(`${label}: expected an explicit numeric iOS version, found ${JSON.stringify(value) ?? 'missing'}.`);
  }
  const parts = value.split('.').map(Number);
  while (parts.length < 3) parts.push(0);
  return parts.join('.');
}

export function checkDeploymentTargets(projectText, podfileText) {
  const platforms = [...podfileText.matchAll(/^\s*platform\s+:ios\s*,\s*(['"])(\d+(?:\.\d+){0,2})\1\s*(?:#.*)?$/gm)];
  // Fail closed on dynamic declarations or extra per-target platform settings.
  const declarations = [...podfileText.matchAll(/^\s*platform\b/gm)];
  if (platforms.length !== 1 || declarations.length !== 1) {
    throw new Error(`${podfilePath}: expected exactly one literal platform :ios, 'VERSION' declaration.`);
  }
  const minimum = platforms[0][2];
  const expected = version(minimum, podfilePath);
  const { objects } = parseProject(projectText);
  if (!objects) throw new Error(`${projectPath}: missing project objects.`);
  const owners = Object.values(objects).filter(object =>
    object.isa === 'PBXProject' ||
    (object.isa === 'PBXNativeTarget' && object.productType === 'com.apple.product-type.application'));
  if (!owners.some(owner => owner.isa === 'PBXNativeTarget')) {
    throw new Error(`${projectPath}: no application target found.`);
  }
  const checked = [];
  const errors = [];
  for (const owner of owners) {
    const label = owner.isa === 'PBXProject' ? 'Project' : `App target "${owner.name}"`;
    const list = objects[owner.buildConfigurationList];
    if (list?.isa !== 'XCConfigurationList' || !Array.isArray(list.buildConfigurations)) {
      throw new Error(`${label}: missing build configuration list.`);
    }
    const configs = list.buildConfigurations.map(id => objects[id]);
    if (configs.some(config => config?.isa !== 'XCBuildConfiguration')) {
      throw new Error(`${label}: invalid build configuration reference.`);
    }
    for (const name of ['Debug', 'Release']) {
      const matches = configs.filter(config => config.name === name);
      if (matches.length !== 1) {
        errors.push(`${label} ${name}: expected exactly one build configuration.`);
        continue;
      }
      const settings = matches[0].buildSettings ?? {};
      const settingLabel = `${label} ${name} IPHONEOS_DEPLOYMENT_TARGET`;
      const targets = Object.entries(settings).filter(([key]) =>
        key === 'IPHONEOS_DEPLOYMENT_TARGET' || key.startsWith('IPHONEOS_DEPLOYMENT_TARGET['));
      if (!Object.hasOwn(settings, 'IPHONEOS_DEPLOYMENT_TARGET')) {
        errors.push(`${settingLabel}: missing explicit deployment target.`);
      }
      for (const [key, target] of targets) {
        try {
          if (version(target, `${label} ${name} ${key}`) !== expected) {
            errors.push(`${label} ${name} ${key} = ${target}; Podfile platform = ${minimum}.`);
          }
        } catch (error) {
          errors.push(error.message);
        }
      }
      checked.push(`${label} ${name}`);
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return { minimum, checked };
}

export function runCheck(root = process.cwd()) {
  try {
    const result = checkDeploymentTargets(
      readFileSync(resolve(root, projectPath), 'utf8'),
      readFileSync(resolve(root, podfilePath), 'utf8'),
    );
    console.log(`iOS deployment targets agree with Podfile (${result.minimum}): ${result.checked.join(', ')}.`);
    return 0;
  } catch (error) {
    console.error(`iOS minimum-version check failed:\n${error.message}\n` +
      `Fix ${projectPath} and ${podfilePath} so every project/app Debug and Release ` +
      'IPHONEOS_DEPLOYMENT_TARGET matches the Podfile platform. Then rerun npm run check:ios.');
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = runCheck();
}

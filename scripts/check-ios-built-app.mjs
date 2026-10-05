import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { getPodfileMinimum, podfilePath, version } from './check-ios-deployment-target.mjs';

const reader = fileURLToPath(new URL('./read-ios-ipa-minimum.py', import.meta.url));

export function checkBuiltAppMinimum(actual, podfileText, label) {
  const minimum = getPodfileMinimum(podfileText);
  if (version(actual, `${label} MinimumOSVersion`) !== version(minimum, podfilePath)) {
    throw new Error(`${label} MinimumOSVersion = ${actual}; Podfile platform = ${minimum}.`);
  }
  return minimum;
}

export function runBuiltCheck(root = process.cwd(), ipaDirectory = 'build/ios/ipa') {
  try {
    const directory = resolve(root, ipaDirectory);
    const ipas = readdirSync(directory, { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith('.ipa'))
      .map(entry => resolve(directory, entry.name)).sort();
    if (!ipas.length) throw new Error(`No exported IPA found in ${directory}.`);
    const podfile = readFileSync(resolve(root, podfilePath), 'utf8');
    // Check every IPA covered by the publishing artifact glob.
    for (const ipa of ipas) {
      const { plist, minimum } = JSON.parse(execFileSync('python3', [reader, ipa], { encoding: 'utf8' }));
      const expected = checkBuiltAppMinimum(minimum, podfile, `${ipa}: ${plist}`);
      console.log(`Exported app MinimumOSVersion agrees with Podfile (${expected}): ${ipa}: ${plist}.`);
    }
    return 0;
  } catch (error) {
    console.error(`Built iOS minimum-version check failed:\n${error.message}\n` +
      'Do not publish this IPA. Inspect the final app Info.plist and Xcode build-time overrides; ' +
      `rebuild so MinimumOSVersion matches ${podfilePath}, then rerun npm run check:ios-built.`);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = runBuiltCheck();
}

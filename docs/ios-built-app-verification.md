# Signed iOS exported-app gate verification

Verified on **9 October 2026 (UTC)** using Codemagic's actual macOS signing,
archive, and IPA export process. This is native CI evidence, not fixture-only
verification.

## Build inputs

- Repository: `Cholly737/BearCave`.
- Verification branch: `ios-built-app-verification`.
- Tested source commit: `0ca041617a7662b089b4b581f6c4d47a4219d24d`.
- Machine: `mac_mini_m2`; existing workflow tool selections retained.
- Podfile platform: **15.0**, unchanged.
- Committed Xcode deployment targets and app Info.plist: unchanged.
- Both native workflows passed all **23 minimum-version regression tests** and
  the repository deployment-target check before archiving.
- No support-floor change or additional user-impact measurement was performed.

## Normal signed build

[Codemagic build 35](https://codemagic.io/app/68f1e0b0ed94571d01ab4538/build/6ac8642f4cd217587a266f6d)
used `ios-build` and exported **version 1.5 (35)**.

| Stage | Result |
| --- | --- |
| Xcode signing, archive, and IPA export | Passed |
| Exported-app minimum-version check | Passed, exit 0 |
| Actual IPA main-app Info.plist | Binary (`bplist00`), MinimumOSVersion `15.0` |
| App Store Connect upload and processing | Completed |
| TestFlight beta-review submission | Created; `WAITING_FOR_REVIEW` |

The exported-app check ran from **03:54:22.957 to 03:54:23.844 UTC**.
Publishing started at **03:54:23.844 UTC**, after the check succeeded.
The separate Apple distribution task completed at **03:58:04.007 UTC**.

Actual Codemagic gate output:

```text
Inspecting exported IPA: /Users/builder/clone/build/ios/ipa/App.ipa: Payload/App.app/Info.plist; Info.plist format: binary; MinimumOSVersion: 15.0.
Exported app MinimumOSVersion agrees with Podfile (15.0): /Users/builder/clone/build/ios/ipa/App.ipa: Payload/App.app/Info.plist.
```

Apple distribution log confirmed:

```text
App Store Connect finished processing build ef3a02b5-054d-4b48-bbb5-56ca845f58c7
Beta review state: WAITING_FOR_REVIEW
Created Beta App Review Submission ef3a02b5-054d-4b48-bbb5-56ca845f58c7
```

Apple beta-review approval and installation on a physical device are not claimed.

## Deliberate mismatch, without publishing

[Codemagic mismatch build 3](https://codemagic.io/app/68f1e0b0ed94571d01ab4538/build/6ac8642f68586a71f83cbaee)
used the manual-only `ios-minimum-mismatch-test` workflow.

The workflow reuses the normal environment, dependency setup, code signing,
source checks, and final IPA checker, but applies this archive-only override:

```text
--archive-xcargs "COMPILER_INDEX_STORE_ENABLE=NO IPHONEOS_DEPLOYMENT_TARGET=16.0"
```

It does not edit the Podfile or committed Xcode settings, has no automatic
triggers, has no publishing configuration, and does not ignore check failures.

| Stage | Result |
| --- | --- |
| Source deployment-target checks | Passed with Podfile `15.0` |
| Xcode signing, archive, and IPA export | Passed |
| Actual IPA main-app Info.plist | Binary (`bplist00`), MinimumOSVersion `16.0` |
| Exported-app minimum-version check | Failed as intended, exit 1 |
| Apple upload/distribution tasks | **Zero** |

Actual gate output:

```text
Inspecting exported IPA: /Users/builder/clone/build/ios/ipa/App.ipa: Payload/App.app/Info.plist; Info.plist format: binary; MinimumOSVersion: 16.0.
Built iOS minimum-version check failed:
/Users/builder/clone/build/ios/ipa/App.ipa: Payload/App.app/Info.plist MinimumOSVersion = 16.0; Podfile platform = 15.0.
Do not publish this IPA. Inspect the final app Info.plist and Xcode build-time overrides; rebuild so MinimumOSVersion matches ios/App/Podfile, then rerun npm run check:ios-built.
```

The failed check completed at **03:51:26.985 UTC**. Codemagic then ran its generic
artifact collection/cleanup publishing phase, but the workflow had no Apple
publisher and created **no App Store Connect distribution task**. The generic
“Publishing” phase succeeding must not be mistaken for an Apple upload.

## Independent inspection of downloaded exports

Both actual `App.ipa` artifacts were downloaded using authenticated Codemagic
access. Each ZIP passed its CRC check, contained a Mach-O main executable,
an embedded provisioning profile, and code-signature resources. Their
`Payload/App.app/Info.plist` files had the binary-plist header.

The downloaded exports were passed through the same production checker against
a copy of the unchanged Podfile: normal returned 0; mismatch returned 1.
The signature resources were inspected, not independently cryptographically
validated on Linux. Native signing/export is evidenced by the successful Xcode
steps, with Apple acceptance providing additional confirmation for the normal
build.

| Export | Bytes | SHA-256 |
| --- | ---: | --- |
| Normal 1.5 (35) | 3,887,045 | `1108603f2da0b3cbc29f1e16ad8162818ea373621e245b66fffacb2c74ddae79` |
| Mismatch 1.5 (3) | 3,842,069 | `3a0638b524ec47dc163e5eb58cba25274fb079397dda11a0013047f97f681b4f` |

No credentials, signed download URLs, or IPA binaries are stored in this report.

## Issues found before the successful runs

The initial attempts did not reach native export and are not counted as gate
verification:

1. Locked tarball URLs referencing Replit's internal package server were
   inaccessible to Codemagic. Only those URLs were changed to the public registry;
   package versions and integrity hashes were preserved. The install step now
   includes build dependencies and explicitly rejects missing build executables.
2. The binary-plist fixture generator passed a string to `plistlib.loads`.
   Codemagic's Python 3.12 rejected it although local Python 3.13 accepted it.
   The fixture now passes bytes; the production IPA reader already used bytes.

## Repeat the verification

Manually run `ios-build` for the normal signed/TestFlight build and
`ios-minimum-mismatch-test` for the expected failing, non-publishing build.
Inspect the exported-app check log and the separate Apple distribution task.
Do not add a publisher to the mismatch workflow or change committed support-floor
settings to make that test pass.

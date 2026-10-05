# iOS 15 minimum deployment plan

**Review date:** 2026-10-05  
**Deadline:** Apple says iOS submissions must target iOS 15 or later starting in April 2027.

## Current compatibility settings

- The Xcode project now sets `IPHONEOS_DEPLOYMENT_TARGET` to `15.0` in all four Debug/Release project and app configurations.
- `ios/App/Podfile` now sets `platform :ios, '15.0'`.
- The installed Capacitor iOS `7.4.3` and Capacitor Push Notifications `7.0.4` podspecs declare iOS `14.0` as their minimum, so they support the app's iOS 15 target without needing package changes.
- The Podfile pins Firebase Messaging `11.15.0`, which supports this iOS 15 target.
- Codemagic uses `xcode: latest`, runs `npx cap sync ios`, `pod install`, and builds the IPA from the Xcode workspace. It does not override the deployment target, so it inherits the iOS 15 target from the Xcode project.

## User impact evidence

Production analytics recorded distinct device IDs on the native iOS platform:

| Reporting window ending 2026-10-05 | iOS devices |
| --- | ---: |
| 30 days | 5 |
| 90 days | 16 |
| 365 days | 49 |

These are observed device IDs, not a count of people or the full installed base. The events record platform but not OS version; no iOS 14 versus iOS 15+ split can be calculated from the current data. The number of observed devices that could be affected is between 0 and 49 for the past year, with the actual iOS 14 count unknown. Untracked users may also exist.

## Decision

The user approved raising the minimum now while accepting that the iOS 14 user count is unknown. Treat the 49 observed iOS devices in the past year as the maximum observed cohort at potential risk, not as an exact count or a confirmed upper bound for the full installed base. No iOS 14 device count is available.

## Verification and remaining work

- This environment does not include Xcode or CocoaPods, so it cannot produce a local iOS archive.
- Codemagic is configured to run on pushes to `main`; its iOS workflow installs pods, builds the IPA, and submits it to TestFlight. It has no deployment-target override.
- The iOS 15 TestFlight build has not yet been verified. Run the Codemagic workflow and confirm the build installs and launches on iOS 15+ before the April 2027 cutoff. Test core app flows and native push registration, and leave time for a second build if needed.

## Status

The minimum is now iOS 15 in the Xcode project and Podfile. The compatibility impact remains unquantified by OS version, as explicitly accepted by the user. TestFlight verification is pending the Codemagic iOS build.

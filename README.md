# TUNER — Interval 1.3.0-rc.1

Release candidate: code and automated checks passed; real-device sign-off remains open. Bass presets include standard four-string, five-string, six-string, Drop D and half-step down. Choose a Bass preset in Tunings. Bass uses a longer analysis window and lower input filter to support low B. Recognition uses bass-specific string anchors. Guitar retains its original analysis window.

## Deploy
1. Extract this ZIP. Upload index.html, sw.js, manifest.webmanifest, assets/ and icons/ together to the same HTTPS directory. No build step or backend is required.
2. Keep the same origin and path as the existing app to retain its browser-saved preferences. Do not clear site data as an update step.
3. Configure sw.js and index.html for revalidation (Cache-Control: no-cache where supported). Serve the manifest as application/manifest+json or application/json and JavaScript as text/javascript.
4. Open the site online, enable the microphone, and check Settings → Install & offline. Install using your browser's install option, or Safari Share → Add to Home Screen.
5. For an existing installation, close all app windows and reopen after the new version downloads. Upload complete releases together. Increment the worker cache version with every future asset change.

The separate guitar-tuner-interval.html download embeds visual assets and does not register a service worker. Use this ZIP for installable/offline behavior. Open either edition through HTTPS or localhost for microphone access.

## Controls
Tap the tuning name and search “Bass” to choose a bass preset, or choose any guitar/custom tuning. Tap a string for a manual target; Auto restores detection. Tools contains guided tuning, reference tones and metronome. Settings contains themes, calibration, tolerance, microphone, haptics and installation. Pitch detail expands measurements. The ribbon runs from +50 cents at the top to −50 at the bottom; yellow marks the detected pitch. Audio processing stays on the device.

## Release verification
See RELEASE-CHECKLIST.md, release-report.json and tests/. Run the Node test files from this package directory. These use mocked browser APIs and synthetic signals; they do not certify real microphone hardware or actual offline installation.

Source baseline: recovered guitar-tuner-modern-final application. Fonts and icons have licenses in assets/. No deployment has been performed.

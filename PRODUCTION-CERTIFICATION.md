# Production Certification

This file records what can be certified from the repository and automated environment, and what still requires physical-device evidence.

## Automated production gate

The release gate must pass before merge:

- every `tests/*.cjs` regression exits successfully;
- all files listed in `checksums.sha256` match exactly;
- application, service-worker, README, checklist and release-report versions agree;
- every offline app-shell file and manifest icon exists;
- the service worker stays inside its own origin/scope;
- the page contains no third-party runtime scripts, analytics, telemetry or app-page network calls;
- accessibility references and dialog names are internally valid;
- production payload remains inside defined size budgets;
- existing pitch, bass, high-register, instrument, strobe, intonation, Stage, Android-history, lifecycle and adversarial tests remain passing.

## Physical-device evidence still required for stable certification

A repository-only run cannot honestly certify a real microphone, Android WebAPK shell, screen reader, battery drain, OS audio focus or physical instrument. Stable promotion therefore requires recorded pass results for:

1. Primary Android phone: install/update/offline relaunch, launcher shortcuts, system Back, portrait/landscape Stage, rotation and fullscreen.
2. Real instrument accuracy: guitar E2–E4, bass B0–C3 and at least one high-register bowed/mandolin target compared with a trusted reference tuner.
3. Acoustic robustness: quiet room, normal conversation/noise, steady HVAC/fan hum, hard pluck, soft pluck and deliberate clipping.
4. Audio lifecycle: background/foreground, lock/unlock, another audio app/call interruption, temporary microphone mute/unmute and input-device route change.
5. Accessibility: keyboard navigation on desktop and screen-reader announcement cadence on one supported device.
6. Endurance: at least 20 minutes of active tuning plus 10 minutes idle listening; confirm no stuck UI, runaway heat or obvious abnormal battery drain.

## Promotion rule

Do **not** label the build stable merely because automated checks pass. Promote the version from release candidate to stable only after every physical-device item above has an explicit recorded pass. Failed items must be fixed or documented as release blockers.

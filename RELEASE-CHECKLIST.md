# Release gate — 1.3.0-rc.2

## Passed here
- Detector algorithm retained; frequency floor extended to 25 Hz, bass analysis window increased to 8192 samples, bass input high-pass set to 18 Hz and bass-specific recognition anchors added.
- 18 synthetic harmonic pitch cases: nine frequencies, 44.1/48 kHz, production 4096-sample buffer; maximum error below 0.34 cents. Silence rejected. This is not real-device accuracy certification.
- Bass: 16 synthetic pitch cases from low B0 through C3 at 44.1/48 kHz, 8192-sample buffer; passed within 2 cents.
- Capture lifecycle regression: cancellation while permission is pending; stale rejection; normal start/stop; disconnected track; denial; restart during cleanup.
- Mock service-worker regression: installation, scope-specific cleanup, online refresh, offline navigation including query strings, cached assets, unrelated URLs ignored, all precache files present.
- Registration regression: failed install handled, own worker activation, existing registration, standalone skips registration.
- Browser controls: tone start/stop, metronome start/stop, guided failure restores idle. Prior iteration checks cover tuning search, settings, custom tunings and responsive views; visual system retained.
- Embedded scripts parse; DOM hooks and unique IDs checked; release archive excludes browser simulation fixtures and development server files.

## Required device sign-off before calling this a final release
Use the deployed HTTPS build on the primary phone and a desktop browser.

- [ ] Tune every guitar string; verify flat/sharp directions and centered lock against a trusted reference. Repeat with sustain, muted strings and ordinary room noise.
- [ ] Deny microphone permission, then allow it and retry. Stop/start repeatedly. Disconnect or change the input.
- [ ] Background and return to the app; test interruption by another audio app. Confirm no stale meter or stuck microphone control.
- [ ] Complete guided tuning for all six strings and restart it.
- [ ] Install, open once online, close, disable networking and reopen. Verify fonts/icons and tuner operation offline.
- [ ] Update an existing installation; close/reopen and confirm the new build with saved preferences intact.
- [ ] Check portrait/landscape, short screens, dark theme, keyboard navigation and available haptic feedback.

The cloud browser preview is HTTP; actual microphone and service-worker installation were not testable here. The checkboxes above are deliberately unmarked.

## Rollback
Keep the previous package. Restore its app files if necessary, but publish sw.js with a NEW cache version so installed clients update. Do not delete user storage. Historical unscoped caches are intentionally retained because another installation may own them.

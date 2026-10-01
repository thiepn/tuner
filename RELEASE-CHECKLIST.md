# Release gate — 1.6.0-rc.1

## Passed here
- Detector algorithm retained; frequency floor extended to 25 Hz, bass analysis window increased to 8192 samples, bass input high-pass set to 18 Hz and bass-specific recognition anchors added.
- 18 synthetic harmonic pitch cases: nine frequencies, 44.1/48 kHz, production 4096-sample buffer; maximum error below 0.34 cents. Silence rejected. This is not real-device accuracy certification.
- Bass: 16 synthetic pitch cases from low B0 through C3 at 44.1/48 kHz, 8192-sample buffer; passed within 2 cents.
- Capture lifecycle regression: cancellation while permission is pending; stale rejection; normal start/stop; disconnected track; denial; restart during cleanup.
- Mock service-worker regression: installation, scope-specific cleanup, online refresh, offline navigation including query strings, cached assets, unrelated URLs ignored, all precache files present.
- Android PWA contract: standalone display, stable app ID/scope, explicit web-app preference, 192/512 + maskable icons, Tuner/Tunings/Tools/Stage launcher shortcuts, install-prompt handling and shortcut launch routing.
- P3 Stage & Mobile contract: immersive Stage UI, Fullscreen fallback, dynamic viewport sizing, coarse-pointer landscape layout, <=360 px portrait hardening, wake-lock recovery and update-ready UI.
- Android Back history contract: Tunings, Tools, Settings, Custom and Stage use a one-level History API state; cancel/backdrop controls return to the tuner rather than bypassing browser history.
- P3 detector isolation: GuitarPitchDetector source block is byte-identical to v1.5.0-rc.1.
- P1 Professional Tuning contract: persisted Meter/Strobe modes, capo 0–12 sounding-target transposition, intonation workflow and saddle/bridge-direction guidance.
- P2 Instrument Expansion contract: profile filters, favorites, custom instrument assignment, re-entrant target order, custom-anchor bypass and profile-aware capo/intonation behavior.
- Expanded preset target validation: 26 built-in tunings, 39 unique target pitches, 78 detector cases at 44.1/48 kHz, zero failures, maximum synthetic error below 0.37 cent.
- High-register detector regression: 493.883, 659.255, 783.991 and 880 Hz at 44.1/48 kHz pass within 3 cents; observed maximum synthetic error below 1.39 cents.
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
- [ ] On Android, open Tunings, Tools, Settings, Custom and Stage one at a time; press system Back and confirm it returns to the tuner before leaving the PWA.
- [ ] Enter Stage in portrait and landscape. Verify the note/cents/meter remain readable at arm's length, Auto and Meter/Strobe work, and Exit returns to normal UI.
- [ ] In browser mode, verify Stage fullscreen enter/exit. In installed standalone mode, verify Stage remains immersive even if the Fullscreen API is unavailable.
- [ ] Rotate while Stage is active and while the normal tuner is active; verify no clipped meter, unreachable controls or stale viewport height.
- [ ] Test a short landscape phone viewport; confirm the tuner and string targets fit without the desktop layout or a multi-row microphone toolbar.
- [ ] While actively tuning, background/foreground and briefly lock/unlock the phone; confirm wake lock and audio recover without a stuck state.
- [ ] Install an older build, then publish this build; verify Settings reports the activated update and Reload update switches the page to the new code.
- [ ] Compare Meter and Strobe on real sustained guitar/bass notes; confirm correct movement direction and that Strobe visibly settles at center.
- [ ] Test capo positions 1, 2, 5, 7 and 12 against an external reference; verify displayed and sounding targets agree.
- [ ] Run intonation on at least two strings against a trusted tuner and verify the saddle/bridge-direction recommendation.
- [ ] Tune a high-G ukulele and 5-string banjo; confirm the re-entrant physical order, manual buttons and Auto targeting behave correctly.
- [ ] Verify violin/viola/cello profiles do not expose capo or fretted-intonation behavior.
- [ ] Verify a mandolin uses course terminology and high capo positions are range-limited when necessary.
- [ ] Favorite built-in and custom tunings, reload/reopen the installed PWA, and confirm Favorites persists.
- [ ] Create, edit, use and delete a re-entrant custom instrument set; confirm deleting it also clears its favorite entry.

The cloud browser preview is HTTP; actual microphone and service-worker installation were not testable here. The checkboxes above are deliberately unmarked.

## Rollback
Keep the previous package. Restore its app files if necessary, but publish sw.js with a NEW cache version so installed clients update. Do not delete user storage. Historical unscoped caches are intentionally retained because another installation may own them.

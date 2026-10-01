# TUNER — Interval 1.7.0-rc.1

Release candidate: P4 Real-World Accuracy, Reliability & Release Hardening implemented; automated and adversarial checks passed; real-device sign-off remains open. Bass presets include standard four-string, five-string, six-string, Drop D and half-step down. Choose a Bass preset in Tunings. Bass uses a longer analysis window and lower input filter to support low B. Recognition uses bass-specific string anchors. Guitar retains its original analysis window.

## Deploy
1. Extract this ZIP. Upload index.html, sw.js, manifest.webmanifest, assets/ and icons/ together to the same HTTPS directory. No build step or backend is required.
2. Keep the same origin and path as the existing app to retain its browser-saved preferences. Do not clear site data as an update step.
3. Configure sw.js and index.html for revalidation (Cache-Control: no-cache where supported). Serve the manifest as application/manifest+json or application/json and JavaScript as text/javascript.
4. Open the site online, enable the microphone, and check Settings → Install & offline. On Android, use Chrome with Google Mobile Services or Samsung Internet for the most native WebAPK-style install; other browsers may create a browser-associated shortcut. On iOS, use Share → Add to Home Screen.
5. For an existing installation, close all app windows and reopen after the new version downloads. Upload complete releases together. Increment the worker cache version with every future asset change.

The separate guitar-tuner-interval.html download embeds visual assets and does not register a service worker. Use this ZIP for installable/offline behavior. Open either edition through HTTPS or localhost for microphone access.

## Controls
Tap the tuning name to browse instrument-first filters for Guitar, Bass, Ukulele, Violin, Viola, Cello, Mandolin, Banjo, Chromatic and saved custom sets. Tap a string for a manual target; Auto restores detection. Tools contains guided tuning, reference tones, metronome and a guided intonation check. Settings contains themes, calibration, tolerance, Meter/Strobe display, capo/transposition, microphone, haptics and installation. Pitch detail expands measurements. The ribbon runs from +50 cents at the top to −50 at the bottom; yellow marks the detected pitch. Audio processing stays on the device.

## Quiet microphone fix
The old amplitude gate discarded quiet strings before pitch analysis. The silence cutoff is now 0.0001 RMS; YIN periodicity and correlation still reject unpitched noise. Verified against 900 quiet, decaying synthetic frames plus broadband noise and silence. Real-device confirmation is still required.

## Release verification
See RELEASE-CHECKLIST.md, release-report.json and tests/. Run the Node test files from this package directory. These use mocked browser APIs and synthetic signals; they do not certify real microphone hardware or actual offline installation.

Source baseline: recovered guitar-tuner-modern-final application. Fonts and icons have licenses in assets/. Repository validation does not certify the live hosting environment.

## Microphone compatibility update
Quiet input (automatic gain) is now the default; Settings → Input sensitivity can restore unprocessed capture. A muted destination keeps the audio graph connected without playing the microphone. Interrupted audio shows Resume audio. Pitch detail reports build, audio state, input dBFS, detector rejection reason and confidence for device troubleshooting. Browser generated-input capture and all seventeen test scripts pass; the reported real-device failure has not yet been confirmed resolved.

## Android PWA integration
The installed Android experience uses standalone display mode, maskable launcher artwork, a stable manifest identity, offline service-worker caching, safe-area aware layout, pull-to-refresh suppression in the app shell, and launcher shortcuts for Tuner, Tunings, Tools and Stage. Shortcut launch parameters are consumed and removed so the installed app returns to a clean canonical URL.


## P1 — Professional Tuning
- **Precision strobe display:** optional moving-band view driven by measured cents error. Direction indicates flat/sharp and motion stops inside ±0.5 cent. It is intentionally described as a strobe-style cents display rather than a phase-measured mechanical strobe.
- **Capo / transposition:** frets 0–12 shift the real sounding targets for string buttons, guided tuning, reference tones and auto recognition. Chromatic mode deliberately ignores the capo setting.
- **Intonation setup:** choose a string and the app automatically captures a stable open-string reading, 12th-fret harmonic and fretted 12th fret. It compares harmonic vs fretted pitch and gives the standard saddle-direction correction for adjustable bridges.
- **High-register support:** detector range extends to 900 Hz. Intonation hides individual strings whose octave measurement would exceed that supported range rather than returning a misleading result.


## P2 — Instrument Expansion
- **Instrument-first library:** filter directly by Guitar, Bass, Ukulele, Violin, Viola, Cello, Mandolin, Banjo or Chromatic instead of scanning one flat tuning list.
- **26 built-in presets:** existing guitar/bass presets plus 7-string and 8-string guitar, high-G/low-G/baritone ukulele, violin, viola, cello, mandolin and 5-string banjo.
- **Re-entrant tuning support:** high-G ukulele and 5-string banjo keep their real physical string order. Custom sets are no longer forced into ascending pitch order.
- **Favorites:** star any built-in or saved tuning and retrieve it from a dedicated Favorites filter. Favorites persist locally.
- **Custom instruments:** saved sets can be assigned to any supported instrument profile or given an arbitrary custom instrument name.
- **Profile-aware behavior:** capo controls disable automatically for non-fretted profiles; intonation is available only for fretted instruments; guitar/bass recognition anchors are not incorrectly applied to other or custom instruments.
- **Mandolin courses:** the UI uses course terminology where appropriate rather than pretending doubled mandolin strings are independent targets.
- **Safe capo range:** capo positions that would place an active tuning above the detector ceiling are automatically range-limited without changing the stored capo preference for other instruments.
- **Expanded detector verification:** all 39 unique pitches used by the built-in preset library passed at 44.1 kHz and 48 kHz (78 synthetic cases total); maximum observed error was approximately 0.37 cent.


## P3 — Stage & Mobile Excellence
- **Stage Mode:** one-tap performance view that reuses the production tuner readout and meter/strobe instead of maintaining a second pitch UI. It exposes only the essential Auto, Meter/Strobe, microphone and Exit controls.
- **Fullscreen where available:** browser Fullscreen is requested from the Stage button when supported; installed PWAs still get the complete CSS-based immersive view when native fullscreen is unavailable or denied.
- **Android Back behavior:** Tunings, Tools, Settings, Custom and Stage use a one-level History API state. Back closes the current TUNER surface before a later Back leaves the app. Escape/cancel and backdrop close paths use the same state.
- **Phone landscape layout:** short coarse-pointer landscape screens get a dedicated two-column tuner/string layout with a compact one-line microphone dock instead of inheriting the desktop layout.
- **Tiny portrait hardening:** <=360 px layouts reduce header/navigation pressure while preserving touch targets and the core meter.
- **Dynamic viewport handling:** Visual Viewport height is tracked into `--app-height` so Stage and phone landscape layouts respond to browser/system UI changes and rotation.
- **Wake-lock recovery:** an unexpected screen-wake-lock release while actively tuning triggers a bounded retry; intentional release on stop/background does not.
- **Update-ready UX:** when a newly activated service worker takes control of an existing installation, Settings surfaces a Reload update action instead of silently leaving the old page code running.
- **Stage launcher shortcut:** Android/PWA shortcut launches directly into Stage Mode.
- **Detector isolation:** P3 changes only the app shell and interaction layer; the production pitch detector block is byte-identical to P2.


## P4 — Real-World Accuracy, Reliability & Release Hardening
- **Configured-octave guard:** ambiguous, moderate-confidence octave errors are corrected only when the folded pitch is dramatically closer to an actual configured target. High-confidence intentional pitches and chromatic mode are never second-guessed.
- **Attack-transient hold:** one suspicious high-energy/low-confidence attack frame can be ignored before it perturbs a stable note. Normal clean plucks remain immediate.
- **Confidence-weighted tune confirmation:** clean signals still confirm after four centered frames; weaker accepted signals need five or six frames before “In tune” and haptic confirmation.
- **Adaptive idle cadence:** analysis runs at the normal 32 ms cadence while active, then backs off to 52 ms after sustained no-pitch input. The pitch detector itself is unchanged.
- **Silence-state preservation:** long silence now clears tracking state once instead of repeatedly rebuilding the UI every analysis cycle.
- **Microphone interruption handling:** MediaStream track mute/unmute is handled separately from permanent track end. Temporary OS/browser microphone interruptions pause analysis and recover without tearing down the whole session.
- **Audio-context recovery:** a visible active session makes one bounded automatic resume attempt after an interruption, then falls back to the existing manual Resume audio control.
- **Capture diagnostics:** diagnostics are throttled to 4 Hz and now report actual capture profile where available plus smoothed analysis cost instead of causing unnecessary DOM work on every pitch frame.
- **Accessibility:** tuning direction/lock changes use a dedicated throttled ARIA live region so screen readers receive meaningful state changes rather than rapid continuous meter chatter.
- **Clipping guidance:** the input assistant explicitly identifies overloaded/clipping microphone input and suggests increasing instrument–microphone distance.
- **Adversarial regression suite:** strong 2nd/3rd harmonics, clipping, noisy high-register notes, noisy low B, broadband noise, configured-octave correction and runtime interruption contracts are now release gates.
- **Core isolation:** `GuitarPitchDetector` and the full P2 instrument/preset block remain byte-identical to v1.6.0-rc.1.

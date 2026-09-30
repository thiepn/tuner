# TUNER — Interval 1.4.0-rc.1

Release candidate: P1 Professional Tuning implemented; code/runtime checks passed; real-device sign-off remains open. Bass presets include standard four-string, five-string, six-string, Drop D and half-step down. Choose a Bass preset in Tunings. Bass uses a longer analysis window and lower input filter to support low B. Recognition uses bass-specific string anchors. Guitar retains its original analysis window.

## Deploy
1. Extract this ZIP. Upload index.html, sw.js, manifest.webmanifest, assets/ and icons/ together to the same HTTPS directory. No build step or backend is required.
2. Keep the same origin and path as the existing app to retain its browser-saved preferences. Do not clear site data as an update step.
3. Configure sw.js and index.html for revalidation (Cache-Control: no-cache where supported). Serve the manifest as application/manifest+json or application/json and JavaScript as text/javascript.
4. Open the site online, enable the microphone, and check Settings → Install & offline. On Android, use Chrome with Google Mobile Services or Samsung Internet for the most native WebAPK-style install; other browsers may create a browser-associated shortcut. On iOS, use Share → Add to Home Screen.
5. For an existing installation, close all app windows and reopen after the new version downloads. Upload complete releases together. Increment the worker cache version with every future asset change.

The separate guitar-tuner-interval.html download embeds visual assets and does not register a service worker. Use this ZIP for installable/offline behavior. Open either edition through HTTPS or localhost for microphone access.

## Controls
Tap the tuning name and search “Bass” to choose a bass preset, or choose any guitar/custom tuning. Tap a string for a manual target; Auto restores detection. Tools contains guided tuning, reference tones, metronome and a guided intonation check. Settings contains themes, calibration, tolerance, Meter/Strobe display, capo/transposition, microphone, haptics and installation. Pitch detail expands measurements. The ribbon runs from +50 cents at the top to −50 at the bottom; yellow marks the detected pitch. Audio processing stays on the device.

## Quiet microphone fix
The old amplitude gate discarded quiet strings before pitch analysis. The silence cutoff is now 0.0001 RMS; YIN periodicity and correlation still reject unpitched noise. Verified against 900 quiet, decaying synthetic frames plus broadband noise and silence. Real-device confirmation is still required.

## Release verification
See RELEASE-CHECKLIST.md, release-report.json and tests/. Run the Node test files from this package directory. These use mocked browser APIs and synthetic signals; they do not certify real microphone hardware or actual offline installation.

Source baseline: recovered guitar-tuner-modern-final application. Fonts and icons have licenses in assets/. No deployment has been performed.

## Microphone compatibility update
Quiet input (automatic gain) is now the default; Settings → Input sensitivity can restore unprocessed capture. A muted destination keeps the audio graph connected without playing the microphone. Interrupted audio shows Resume audio. Pitch detail reports build, audio state, input dBFS, detector rejection reason and confidence for device troubleshooting. Browser generated-input capture and all eight test scripts pass; the reported real-device failure has not yet been confirmed resolved.

## Android PWA integration
The installed Android experience uses standalone display mode, maskable launcher artwork, a stable manifest identity, offline service-worker caching, safe-area aware layout, pull-to-refresh suppression in the app shell, and launcher shortcuts for Tuner, Tunings and Tools. Shortcut launch parameters are consumed and removed so the installed app returns to a clean canonical URL.


## P1 — Professional Tuning
- **Precision strobe display:** optional moving-band view driven by measured cents error. Direction indicates flat/sharp and motion stops inside ±0.5 cent. It is intentionally described as a strobe-style cents display rather than a phase-measured mechanical strobe.
- **Capo / transposition:** frets 0–12 shift the real sounding targets for string buttons, guided tuning, reference tones and auto recognition. Chromatic mode deliberately ignores the capo setting.
- **Intonation setup:** choose a string and the app automatically captures a stable open-string reading, 12th-fret harmonic and fretted 12th fret. It compares harmonic vs fretted pitch and gives the standard saddle-direction correction for adjustable bridges.
- **High-register support:** detector range extends to 900 Hz. Intonation hides individual strings whose octave measurement would exceed that supported range rather than returning a misleading result.

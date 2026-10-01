const fs=require('fs'),assert=require('assert/strict');
const source=fs.readFileSync('./index.html','utf8');
for(const id of ['tunerAnnouncement','captureDiagnostics','signalBars']){
  assert(source.includes(`id="${id}"`),'Missing '+id);
}
for(const fn of ['nearestConfiguredPitchDistance','correctConfiguredOctave','shouldHoldAttackTransient','announceTuningStatus','updateCaptureDiagnostics','currentAnalysisInterval','clearAudioRecoveryTimer','scheduleAudioRecovery']){
  assert(source.includes('function '+fn+'('),'Missing '+fn);
}
assert(source.includes('const ANALYSIS_IDLE_INTERVAL_MS = 52'));
assert(source.includes('const DIAGNOSTICS_INTERVAL_MS = 250'));
assert(source.includes("track.addEventListener('mute'"));
assert(source.includes("track.addEventListener('unmute'"));
assert(source.includes('analysisCostMs = analysisCostMs > 0 ? analysisCostMs * 0.82 + cost * 0.18 : cost'));
assert(source.includes('resetTracker({ preserveNoPitch: true })'));
assert(source.includes('confidence < 0.82'));
assert(source.includes("role=\"status\" aria-live=\"polite\" aria-atomic=\"true\""));
console.log('PASS: P4 adaptive cadence, interruption recovery, diagnostics and accessibility contract');

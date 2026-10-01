const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('./index.html','utf8');
const start=source.indexOf('      function nearestConfiguredPitchDistance');
const end=source.indexOf('      function correctTargetOctave',start);
const code=source.slice(start,end);
const midi={E2:40,A2:45,D3:50,G3:55,B3:59,E4:64};
const ctx={
  DETECTOR_MIN_HZ:25,DETECTOR_MAX_HZ:900,selectedMidi:null,currentTuning:{mode:'strings'},
  tuningTargets:()=>Object.values(midi).map(midi=>({midi})),
  freqForMidi:m=>440*Math.pow(2,(m-69)/12),
  centsBetween:(a,b)=>1200*Math.log2(a/b),
  performance:{now:()=>1000},Number,Math,
  lastVoicedAt:0,lastVoicedRms:0,transientHoldFrames:0,
  tunerAnnouncement:null,confirmedLock:false,tuneState:'waiting',lastAnnouncedSignature:'',lastAnnouncementAt:0,
  prettyNote:x=>x,audioContext:null,captureProfile:'default',trackMuted:false,analysisCostMs:0,lastDiagnosticsAt:0,DIAGNOSTICS_INTERVAL_MS:250,
  $:()=>({textContent:''}),running:false,document:{hidden:false},audioRecoveryTimer:null,audioRecoveryAttempts:0,clearTimeout, setTimeout,
  ANALYSIS_IDLE_INTERVAL_MS:52,ANALYSIS_INTERVAL_MS:32,noPitchFrames:0
};
vm.createContext(ctx);vm.runInContext(code,ctx);
const e2=ctx.freqForMidi(40);
const humAliased=e2/1.977;
const corrected=ctx.correctConfiguredOctave(humAliased,0.88);
assert(Math.abs(1200*Math.log2(corrected/e2))<90,'Ambiguous hum/octave result should fold toward configured E2');
assert.equal(ctx.correctConfiguredOctave(55,0.99),55,'High-confidence intentional octave must not be folded');
assert.equal(ctx.correctConfiguredOctave(e2*1.01,0.80),e2*1.01,'Already-near target must not be folded');
ctx.noPitchFrames=0;assert.equal(ctx.currentAnalysisInterval(),32);
ctx.noPitchFrames=18;assert.equal(ctx.currentAnalysisInterval(),52);
console.log('PASS: configured-octave guard is confidence-limited and idle cadence backs off');

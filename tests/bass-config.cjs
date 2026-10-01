const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const s=fs.readFileSync('./index.html','utf8');
const a=s.indexOf('      const INSTRUMENT_PROFILES'),b=s.indexOf('      const $ = (id)',a);
const c={
  currentTuning:{id:'bass-six',instrument:'bass',mode:'strings',strings:['B0','E1','A1','D2','G2','C3']},
  capoFret:0,referenceA:440,analyser:{},audioContext:{sampleRate:48000},highpassNode:{frequency:{}},
  Float32Array,DETECTOR_MAX_HZ:900,
  noteToMidi:n=>({B0:23,E1:28,A1:33,D2:38,G2:43,C3:48,E2:40,A2:45,D3:50,G3:55,B3:59,E4:64}[n]??null),
  freqForMidi:m=>440*Math.pow(2,(m-69)/12),
  tuningTargets:()=>[{midi:23}],
  GuitarPitchDetector:class{constructor(sr,size){this.size=size}}
};
vm.createContext(c);vm.runInContext(s.slice(a,b),c);
c.configureAnalysis();assert.equal(c.analyser.fftSize,8192);assert.equal(c.highpassNode.frequency.value,18);assert.deepEqual(Array.from(c.sourceAnchorsFor(6)),[23,28,33,38,43,48]);
c.currentTuning={id:'standard',instrument:'guitar',mode:'strings',strings:['E2','A2','D3','G3','B3','E4']};c.tuningTargets=()=>[{midi:40}];c.configureAnalysis();assert.equal(c.analyser.fftSize,4096);assert.equal(c.highpassNode.frequency.value,32);assert.deepEqual(Array.from(c.sourceAnchorsFor(6)),[40,45,50,55,59,64]);
c.currentTuning={id:'custom-x',instrument:'guitar',mode:'strings',strings:['E2','A2','D3','G3','B3','E4']};assert.equal(c.sourceAnchorsFor(6),undefined);
c.currentTuning={id:'chromatic',instrument:'chromatic',mode:'chromatic',strings:['E2','A2','D3','G3','B3','E4']};c.configureAnalysis();assert.equal(c.analyser.fftSize,8192);
console.log('PASS: live bass/guitar analysis switching, profile-aware anchors, custom-anchor bypass, chromatic low-frequency window');

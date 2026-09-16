const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const s=fs.readFileSync('./index.html','utf8');
const a=s.indexOf('      const GUITAR_SOURCE_ANCHORS'),b=s.indexOf('      const $ = (id)',a);
const c={currentTuning:{instrument:'bass',mode:'strings'},analyser:{},audioContext:{sampleRate:48000},highpassNode:{frequency:{}},Float32Array,tuningTargets:()=>[{midi:40}],GuitarPitchDetector:class{constructor(sr,size){this.size=size}}};vm.createContext(c);vm.runInContext(s.slice(a,b),c);
c.configureAnalysis();assert.equal(c.analyser.fftSize,8192);assert.equal(c.highpassNode.frequency.value,18);assert.deepEqual(Array.from(c.sourceAnchorsFor(6)),[23,28,33,38,43,48]);
c.currentTuning.instrument='guitar';c.configureAnalysis();assert.equal(c.analyser.fftSize,4096);assert.equal(c.highpassNode.frequency.value,32);assert.deepEqual(Array.from(c.sourceAnchorsFor(6)),[40,45,50,55,59,64]);
c.currentTuning.mode='chromatic';c.configureAnalysis();assert.equal(c.analyser.fftSize,8192);
console.log('PASS: live bass/guitar analysis switching, bass six-string anchors, chromatic low-frequency window');

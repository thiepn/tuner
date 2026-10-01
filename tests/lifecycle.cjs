const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('./index.html','utf8');
const code=source.slice(source.indexOf('      async function start()'),source.indexOf("      startBtn.addEventListener('click'"));
const defer=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return{promise,resolve,reject}};
const elem=()=>({classList:{add(){},remove(){},contains(){return false},toggle(){}},dataset:{},textContent:''});
function setup(){
 let request=defer(),listeners={},stops=0,closed=0;
 const track={muted:false,stop(){stops++},getSettings(){return{sampleRate:48000,autoGainControl:true}},addEventListener(n,fn){listeners[n]=fn}};
 const stream={getTracks:()=>[track],getAudioTracks:()=>[track]};
 const node=()=>({connect(){},disconnect(){},frequency:{},Q:{},fftSize:4096});
 class Audio{constructor(){this.sampleRate=48000;this.state="running";this.destination={}}addEventListener(n,f){this.listener=f}createGain(){return {...node(),gain:{value:1}}}async resume(){this.state="running"}async close(){closed++}createMediaStreamSource(){return node()}createBiquadFilter(){return node()}createAnalyser(){return node()}}
 const c={document:{hidden:false},$:()=>elem(),silentOutput:null,console:{error(){}},navigator:{mediaDevices:{getUserMedia(){}}},window:{isSecureContext:true,AudioContext:Audio},DOMException,Float32Array,
 running:false,starting:false,captureEpoch:0,stopPromise:null,startBtn:elem(),micPanel:elem(),hint:elem(),appEl:elem(),mediaStream:null,audioContext:null,sourceNode:null,highpassNode:null,lowpassNode:null,analyser:null,detector:null,analysisBuffer:null,rafId:0,micPermissionState:'unknown',hasDetectedPitchBefore:false,
 activeAudioTrack:null,trackMuted:false,captureProfile:'default',lastAnalysisAt:0,lastDiagnosticsAt:0,analysisCostMs:0,audioRecoveryAttempts:0,
 getMicrophoneStream:()=>request.promise,refreshMicrophoneDevices:async()=>{},GuitarPitchDetector:class{},microphoneErrorMessage:e=>e.message};
 for(const n of ['configureAnalysis','setStatus','stopReferenceTone','stopMetronome','resetTracker','loop','focusTunerForPlaying','requestWakeLock','releaseWakeLock','applyMicPermissionUi','resetDisplay','cancelAnimationFrame','clearAudioRecoveryTimer','scheduleAudioRecovery','updateCaptureDiagnostics'])c[n]=()=>{};
 vm.createContext(c);vm.runInContext(code,c);
 return{c,request,stream,track,listeners,get stops(){return stops},get closed(){return closed},emit(name){listeners[name]?.()}};
}
(async()=>{
 let t=setup(),p=t.c.start(); await t.c.stop();t.request.resolve(t.stream);assert.equal(await p,false);assert.equal(t.stops,1);assert.equal(t.c.running,false);
 t=setup();p=t.c.start();await t.c.stop();t.request.reject(new DOMException('Denied','NotAllowedError'));assert.equal(await p,false);assert.equal(t.c.micPermissionState,'unknown');
 t=setup();p=t.c.start();t.request.resolve(t.stream);assert.equal(await p,true);assert.equal(t.c.running,true);assert.equal(t.c.silentOutput.gain.value,0);assert.match(t.c.captureProfile,/48 kHz/);assert.match(t.c.captureProfile,/AGC/);
 t.c.audioContext.state='suspended';t.c.audioContext.listener();assert.equal(t.c.startBtn.textContent,'Resume audio');t.c.audioContext.state='running';t.c.audioContext.listener();assert.equal(t.c.startBtn.textContent,'Stop');
 t.emit('mute');assert.equal(t.c.trackMuted,true);t.emit('unmute');assert.equal(t.c.trackMuted,false);
 await t.c.stop();assert.equal(t.stops,1);assert.equal(t.closed,1);assert.equal(t.c.running,false);assert.equal(t.c.startBtn.disabled,false);
 t=setup();p=t.c.start();t.request.resolve(t.stream);await p;t.emit('ended');await t.c.stopPromise;assert.equal(t.c.running,false);assert.equal(t.stops,1);
 t=setup();p=t.c.start();t.request.reject(new DOMException('Denied','NotAllowedError'));assert.equal(await p,false);assert.equal(t.c.micPermissionState,'denied');assert.equal(t.c.startBtn.disabled,false);
 t=setup();p=t.c.start();t.request.resolve(t.stream);await p;const stopped=t.c.stop();const restarted=t.c.start();await stopped;assert.equal(await restarted,true);await t.c.stop();
 console.log('PASS: pending cancellation, capture profile, start/stop, mute/unmute, audio interruption UI, disconnect, denial and restart');
})().catch(e=>{console.error(e);process.exit(1)});

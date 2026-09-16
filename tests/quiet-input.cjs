const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const path=process.argv[2]||'./index.html';const s=fs.readFileSync(path,'utf8');const code=s.slice(s.indexOf('      class GuitarPitchDetector'),s.indexOf('      function samePitchRegion'));
const ctx={Float32Array,Math,Number,DETECTOR_MIN_HZ:25,DETECTOR_MAX_HZ:500,clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};vm.createContext(ctx);vm.runInContext(code+';this.Detector=GuitarPitchDetector',ctx);
let seed=173;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296-.5};
let passed=0,total=0,noiseFalse=0;
for(const sr of [44100,48000])for(const f of [30.868,41.203,55,73.416,82.407,110,146.832,195.998,246.942,329.628]){
 const size=f<80?8192:4096,d=new ctx.Detector(sr,size);
 for(let frame=0;frame<45;frame++){
 const t=frame*.05,a=Float32Array.from({length:size},(_,i)=>{const time=t+i/sr;const amp=.002*Math.exp(-time/1.3);return amp*(Math.sin(2*Math.PI*f*time)+.35*Math.sin(4*Math.PI*f*time))+.000035*rand()});
 const r=d.analyze(a);total++;if(r.pitch&&Math.abs(1200*Math.log2(r.pitch/f))<3)passed++;
 }
}
const noiseDetector=new ctx.Detector(48000,8192);for(let j=0;j<80;j++){const r=noiseDetector.analyze(Float32Array.from({length:8192},()=>.01*rand()));if(r.pitch)noiseFalse++}
console.log(JSON.stringify({weakDecayingFrames:total,correctDetections:passed,noiseFalseDetections:noiseFalse}));assert.equal(passed,total,'Quiet plucked notes must remain detectable');assert.equal(noiseFalse,0,'Broadband noise must not become a note');assert(!noiseDetector.analyze(new Float32Array(8192)).pitch);

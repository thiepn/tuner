const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('./index.html','utf8');
const extract=s=>s.slice(s.indexOf('      class GuitarPitchDetector'),s.indexOf('      function samePitchRegion'));
const context={Float32Array,Math,Number,DETECTOR_MIN_HZ:25,DETECTOR_MAX_HZ:900,clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
vm.createContext(context);vm.runInContext(extract(source)+'\nthis.Detector=GuitarPitchDetector;',context);
const rand=(seed=>()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296})(12345);
function analyze(f,{sr=48000,size=4096,fund=.14,h2=.04,h3=.02,noise=0,clip=1}={}){
 const d=new context.Detector(sr,size);let r;
 for(let frame=0;frame<9;frame++){
  const a=new Float32Array(size);
  for(let i=0;i<size;i++){
   const t=(i+frame*size)/sr;
   let v=fund*Math.sin(2*Math.PI*f*t)+h2*Math.sin(4*Math.PI*f*t)+h3*Math.sin(6*Math.PI*f*t)+noise*(rand()*2-1);
   a[i]=Math.max(-clip,Math.min(clip,v));
  }
  r=d.analyze(a);
 }
 const error=r.pitch?1200*Math.log2(r.pitch/f):Infinity;
 return {r,error};
}
for(const [f,opt,max] of [
 [110,{fund:.035,h2:.22,h3:.09},2],
 [110,{fund:.035,h2:.05,h3:.20},2],
 [110,{fund:.75,h2:.35,h3:.22,clip:.7},3],
 [659.255,{fund:.12,h2:.025,noise:.02},4],
 [30.868,{size:8192,fund:.12,h2:.05,h3:.03,noise:.018},4]
]){
 const {r,error}=analyze(f,opt);assert(r.pitch&&Math.abs(error)<max,`${f}Hz failed: ${JSON.stringify({r,error})}`);
}
const noiseOnly=new context.Detector(48000,4096).analyze(Float32Array.from({length:4096},()=>.025*(rand()*2-1)));
assert(!noiseOnly.pitch,'Broadband noise must not be accepted as a stable pitch');
console.log('PASS: harmonic-heavy, clipped, high-register, low-bass and broadband-noise adversarial signals');

const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('./index.html','utf8');
const extract=s=>s.slice(s.indexOf('      class GuitarPitchDetector'),s.indexOf('      function samePitchRegion'));
const context={Float32Array,Math,Number,DETECTOR_MIN_HZ:25,DETECTOR_MAX_HZ:900,clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
vm.createContext(context);vm.runInContext(extract(source)+'\nthis.Detector=GuitarPitchDetector;',context);
const results=[];
for(const sampleRate of [44100,48000]) for(const f of [493.883,659.255,783.991,880]){
  const d=new context.Detector(sampleRate,4096);let r;
  for(let j=0;j<8;j++){
    const a=Float32Array.from({length:4096},(_,i)=>.2*Math.sin(2*Math.PI*f*(i+j*4096)/sampleRate)+.03*Math.sin(4*Math.PI*f*(i+j*4096)/sampleRate));
    r=d.analyze(a);
  }
  const err=r.pitch?1200*Math.log2(r.pitch/f):Infinity;
  assert(r.pitch&&Math.abs(err)<3,`${f}: ${JSON.stringify(r)}`);
  results.push({sampleRate,frequency:f,detected:r.pitch,centsError:err});
}
console.log(JSON.stringify({highRegister:'passed',results},null,2));

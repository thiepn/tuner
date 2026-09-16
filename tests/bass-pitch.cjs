const fs=require('fs'),vm=require('vm'),assert=require('assert');
const updated=fs.readFileSync('./index.html','utf8');
const extract=s=>s.slice(s.indexOf('      class GuitarPitchDetector'),s.indexOf('      function samePitchRegion'));
const context={Float32Array,Math,Number,DETECTOR_MIN_HZ:25,DETECTOR_MAX_HZ:500,clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};vm.createContext(context);vm.runInContext(extract(updated)+'\nthis.Detector=GuitarPitchDetector;',context);
const results=[];for(const sampleRate of [44100,48000]) for(const f of [30.868,36.708,38.891,41.203,55,73.416,97.999,130.813]){const d=new context.Detector(sampleRate,8192);let r;for(let j=0;j<8;j++){let a=Float32Array.from({length:8192},(_,i)=>.2*Math.sin(2*Math.PI*f*(i+j*8192)/sampleRate)+.04*Math.sin(4*Math.PI*f*(i+j*8192)/sampleRate));r=d.analyze(a);}const err=1200*Math.log2(r.pitch/f);assert(r.pitch&&Math.abs(err)<2,`${f}: ${JSON.stringify(r)}`);results.push({sampleRate,bufferSize:8192,frequency:f,detected:r.pitch,centsError:err});}
const d=new context.Detector(48000,8192);assert(!d.analyze(new Float32Array(8192)).pitch,'Silence rejected');
const ids=[...updated.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length,'No duplicate IDs');for(const [,id] of updated.matchAll(/\$\('([^']+)'\)/g))assert(ids.includes(id),'Missing DOM hook '+id);
console.log(JSON.stringify({silence:'rejected',domHooks:'complete',results},null,2));

const fs=require('fs'),assert=require('assert/strict'),vm=require('vm');
const source=fs.readFileSync('./index.html','utf8');
const start=source.indexOf('      const INSTRUMENT_PROFILES');
const end=source.indexOf('      // Recognition anchors',start);
const ctx={};vm.createContext(ctx);
vm.runInContext(source.slice(start,end).replace('      const INSTRUMENT_PROFILES','      this.INSTRUMENT_PROFILES').replace('      const INSTRUMENT_ORDER','      this.INSTRUMENT_ORDER').replace('      const BUILTIN_TUNINGS','      this.BUILTIN_TUNINGS'),ctx);
const noteToMidi=value=>{
  const m=/^([A-Ga-g])([#b♯♭]?)(-?\d)$/.exec(value);if(!m)return null;
  const base={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1].toUpperCase()];
  const accidental=m[2]==='#'||m[2]==='♯'?1:m[2]==='b'||m[2]==='♭'?-1:0;
  return 12*(Number(m[3])+1)+base+accidental;
};
const ids=new Set(),profiles=new Set(Object.keys(ctx.INSTRUMENT_PROFILES));
for(const t of ctx.BUILTIN_TUNINGS){
  assert(!ids.has(t.id),'Duplicate tuning id '+t.id);ids.add(t.id);
  assert(profiles.has(t.instrument),'Unknown profile '+t.instrument);
  assert(t.mode==='chromatic'||(t.strings.length>=4&&t.strings.length<=8),'Invalid target count '+t.id);
  for(const note of t.strings){
    const midi=noteToMidi(note);assert(midi!=null,'Bad note '+t.id+' '+note);
    const hz=440*Math.pow(2,(midi-69)/12);
    assert(hz>=25&&hz<=900,`Out of detector range ${t.id} ${note} ${hz}`);
  }
}
const find=id=>ctx.BUILTIN_TUNINGS.find(t=>t.id===id);
assert.deepEqual(Array.from(find('ukulele-standard').strings),['G4','C4','E4','A4']);
assert.deepEqual(Array.from(find('banjo-open-g').strings),['G4','D3','G3','B3','D4']);
assert.deepEqual(Array.from(find('violin-standard').strings),['G3','D4','A4','E5']);
assert.deepEqual(Array.from(find('cello-standard').strings),['C2','G2','D3','A3']);
assert.deepEqual(Array.from(find('mandolin-standard').strings),['G3','D4','A4','E5']);
console.log(`PASS: ${ctx.BUILTIN_TUNINGS.length} built-in tunings across ${profiles.size} profiles are valid and in detector range`);

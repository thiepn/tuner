const fs=require('fs'),assert=require('assert/strict');
const source=fs.readFileSync('./index.html','utf8');
for(const id of ['strobePanel','displayModeButtons','capoSelect','intonationPanel','intonationStringSelect','intonationStartBtn']){
  assert(source.includes(`id="${id}"`), 'Missing '+id);
}
for(const fn of ['applyDisplayMode','applyCapo','updateStrobeDisplay','startIntonation','registerIntonationReading','renderIntonationVerdict']){
  assert(source.includes('function '+fn+'('), 'Missing '+fn);
}
assert(source.includes("const STORAGE_DISPLAY_MODE = 'guitarTuner.displayMode.v1'"));
assert(source.includes("const STORAGE_CAPO = 'guitarTuner.capo.v1'"));
assert(source.includes("motion stops within 0.5¢"));
assert(source.includes("moving it away from the neck"));
assert(source.includes("moving it toward the neck"));
assert(source.includes("return { label: transpose ? midiToNote(midi) : baseLabel"));
console.log('PASS: professional tuner UI, persistence, capo targets, strobe and intonation workflow present');

const fs=require('fs'),assert=require('assert/strict');
const source=fs.readFileSync('./index.html','utf8');
for(const id of ['instrumentFilters','presetCount','customInstrumentSelect','customInstrumentLabel','tuningPresetGrid']){
  assert(source.includes(`id="${id}"`),'Missing '+id);
}
for(const fn of ['renderInstrumentFilters','toggleFavorite','loadFavoriteTunings','visibleTuningsForFilter','getInstrumentProfile','getInstrumentLabel','maxSafeCapo']){
  assert(source.includes('function '+fn+'('),'Missing '+fn);
}
for(const preset of ['guitar-seven-standard','guitar-eight-standard','ukulele-standard','ukulele-low-g','ukulele-baritone','violin-standard','viola-standard','cello-standard','mandolin-standard','banjo-open-g']){
  assert(source.includes(`id:'${preset}'`)||source.includes(`id: '${preset}'`),'Missing preset '+preset);
}
assert(source.includes("const STORAGE_FAVORITES = 'guitarTuner.favoriteTunings.v1'"));
assert(source.includes("const STORAGE_INSTRUMENT_FILTER = 'guitarTuner.instrumentFilter.v1'"));
assert(source.includes("Re-entrant order is allowed"));
assert(!source.includes('Enter strings from lowest pitch to highest pitch.'));
assert(source.includes("if (currentTuning.id?.startsWith('custom-')) return undefined;"));
console.log('PASS: P2 instrument profiles, favorites, instrument filters and re-entrant custom sets');

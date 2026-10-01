const fs=require('fs'),assert=require('assert/strict');
const html=fs.readFileSync('./index.html','utf8');
const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
assert.equal(ids.size,[...html.matchAll(/\bid="([^"]+)"/g)].length,'Duplicate DOM ids');

for(const m of html.matchAll(/<dialog\b([^>]*)>/g)){
  const attrs=m[1];
  const labelled=(attrs.match(/aria-labelledby="([^"]+)"/)||[])[1];
  const label=(attrs.match(/aria-label="([^"]+)"/)||[])[1];
  assert(label||labelled,'Dialog missing accessible name');
  if(labelled) assert(ids.has(labelled),'Dialog aria-labelledby target missing: '+labelled);
}
for(const m of html.matchAll(/aria-describedby="([^"]+)"/g)) assert(ids.has(m[1]),'Missing aria-describedby target: '+m[1]);
for(const m of html.matchAll(/aria-labelledby="([^"]+)"/g)) assert(ids.has(m[1]),'Missing aria-labelledby target: '+m[1]);

assert(html.includes('id="tunerAnnouncement" role="status" aria-live="polite"'));
assert(html.includes('aria-valuemin="-50"'));
assert(html.includes('aria-valuemax="50"'));
assert(html.includes('@media(prefers-reduced-motion:reduce)'));
assert(html.includes('button:focus-visible')||html.includes(':focus-visible'));
assert(!/<img(?![^>]*\balt=)[^>]*>/i.test(html),'Image without alt attribute');
console.log('PASS: dialog naming, ARIA references, live status, meter semantics, reduced motion and image alt contract');

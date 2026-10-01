const fs=require('fs'),assert=require('assert/strict');
const index=fs.readFileSync('./index.html','utf8');
const sw=fs.readFileSync('./sw.js','utf8');
const manifest=JSON.parse(fs.readFileSync('./manifest.webmanifest','utf8'));
const report=JSON.parse(fs.readFileSync('./release-report.json','utf8'));
const readme=fs.readFileSync('./README.md','utf8');
const checklist=fs.readFileSync('./RELEASE-CHECKLIST.md','utf8');

const indexVersion=(index.match(/meta name="app-version" content="([^"]+)"/)||[])[1];
const swVersion=(sw.match(/CACHE_NAME = CACHE_PREFIX \+ '([^']+)'/)||[])[1];
const readmeVersion=(readme.match(/^# TUNER — Interval (.+)$/m)||[])[1];
const checklistVersion=(checklist.match(/^# Release gate — (.+)$/m)||[])[1];

for(const [name,value] of Object.entries({indexVersion,swVersion,readmeVersion,checklistVersion,reportVersion:report.version})){
  assert(value, 'Missing '+name);
}
assert.equal(swVersion,indexVersion,'Service-worker cache version differs from app version');
assert.equal(readmeVersion,indexVersion,'README version differs from app version');
assert.equal(checklistVersion,indexVersion,'Checklist version differs from app version');
assert.equal(report.version,indexVersion,'Release report version differs from app version');
assert.equal(manifest.id,'./');
assert.equal(manifest.scope,'./');
assert.equal(manifest.display,'standalone');
assert(manifest.icons.some(x=>x.sizes==='192x192'));
assert(manifest.icons.some(x=>x.sizes==='512x512'));
assert(manifest.icons.some(x=>x.purpose==='maskable'));
assert(index.includes('manifest.webmanifest'));
assert(index.includes('serviceWorker.register(\'./sw.js\''));
assert(!indexVersion.includes('undefined'));
console.log('PASS: version, manifest, service-worker and release metadata are internally consistent at '+indexVersion);

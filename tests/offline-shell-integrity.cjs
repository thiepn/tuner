const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const sw=fs.readFileSync('./sw.js','utf8');
const manifest=JSON.parse(fs.readFileSync('./manifest.webmanifest','utf8'));
const shellMatch=sw.match(/const APP_SHELL = \[([\s\S]*?)\];/);
assert(shellMatch,'APP_SHELL missing');
const shell=[...shellMatch[1].matchAll(/"([^"]+)"/g)].map(m=>m[1]);
assert(shell.includes('./'));
assert(shell.includes('./index.html'));
assert(shell.includes('./manifest.webmanifest'));
for(const item of shell){
  if(item==='./') continue;
  const local=item.replace(/^\.\//,'');
  assert(fs.existsSync(path.resolve(local)),'Missing cached shell asset: '+item);
}
for(const icon of manifest.icons){
  const local=icon.src.replace(/^\.\//,'');
  assert(fs.existsSync(path.resolve(local)),'Missing manifest icon: '+icon.src);
}
for(const shortcut of manifest.shortcuts){
  assert(shortcut.url.startsWith('./'),'Shortcut escapes app scope: '+shortcut.url);
}
assert(sw.includes("if (url.origin !== self.location.origin) return;"),'Service worker must ignore cross-origin requests');
assert(sw.includes("if (!isAppNavigation && !isShellAsset) return;"),'Service worker must ignore unrelated same-origin traffic');
console.log('PASS: '+shell.length+' offline shell entries and all manifest icons exist and stay scope-contained');

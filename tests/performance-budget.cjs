const fs=require('fs'),assert=require('assert/strict');
const indexBytes=fs.statSync('./index.html').size;
const swBytes=fs.statSync('./sw.js').size;
const manifestBytes=fs.statSync('./manifest.webmanifest').size;
const fontFiles=fs.readdirSync('./assets').filter(x=>/\.(woff2?|ttf|otf)$/i.test(x));
const fontBytes=fontFiles.reduce((n,x)=>n+fs.statSync('./assets/'+x).size,0);
const iconFiles=fs.readdirSync('./icons').filter(x=>/\.png$/i.test(x));
const iconBytes=iconFiles.reduce((n,x)=>n+fs.statSync('./icons/'+x).size,0);
const coreBytes=indexBytes+swBytes+manifestBytes+fontBytes+iconBytes;

assert(indexBytes<300*1024,`index.html exceeds 300 KiB budget: ${indexBytes}`);
assert(fontBytes<350*1024,`fonts exceed 350 KiB budget: ${fontBytes}`);
assert(iconBytes<450*1024,`icons exceed 450 KiB budget: ${iconBytes}`);
assert(coreBytes<1100*1024,`core install payload exceeds 1.1 MiB budget: ${coreBytes}`);
console.log(JSON.stringify({status:'passed',indexBytes,swBytes,manifestBytes,fontBytes,iconBytes,coreBytes},null,2));

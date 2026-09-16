const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('./sw.js','utf8');
const scope='https://example.test/tuner/';const handlers={},stores=new Map();let online=true,body='new-online',claimed=false;
const key=x=>new URL(typeof x==='string'?x:x.url,scope).href;
const caches={async open(name){if(!stores.has(name))stores.set(name,new Map());const m=stores.get(name);return{async addAll(paths){for(const p of paths)m.set(key(p),new Response('installed:'+p))},async match(r){return m.get(key(r))?.clone()},async put(r,v){m.set(key(r),v.clone())}}},async keys(){return [...stores.keys()]},async delete(n){return stores.delete(n)}};
const ctx={URL,Response,AbortController,setTimeout,clearTimeout,caches,self:{registration:{scope},location:{origin:'https://example.test'},skipWaiting:async()=>{},clients:{claim:async()=>{claimed=true}},addEventListener:(n,fn)=>handlers[n]=fn},fetch:async()=>{if(!online)throw Error('offline');return new Response(body)}};
vm.createContext(ctx);vm.runInContext(source,ctx);
async function lifecycle(n){let task;handlers[n]({waitUntil:p=>task=p});await task}
async function fetchPage(path,mode='navigate'){let result;handlers.fetch({request:{method:'GET',url:new URL(path,scope).href,mode},respondWith:p=>result=p});return result?await result:undefined}
(async()=>{
 const prefix='guitar-tuner-'+encodeURIComponent(scope)+'-';stores.set(prefix+'old',new Map());stores.set('guitar-tuner-another-install',new Map());
 await lifecycle('install');await lifecycle('activate');assert(claimed);assert(!stores.has(prefix+'old'));assert(stores.has('guitar-tuner-another-install'));
 assert.equal(await(await fetchPage('./')).text(),'new-online');online=false;assert.equal(await(await fetchPage('./?from=home')).text(),'new-online');
 assert.equal(await(await fetchPage('./assets/Mic.svg','cors')).text(),'installed:./assets/Mic.svg');assert.equal(await fetchPage('../unrelated/'),undefined);assert.equal(await fetchPage('https://other.test/'),undefined);
 const files=vm.runInContext('APP_SHELL',ctx);assert.equal(files.length,new Set(files).size);for(const f of files){if(f==='./')continue;assert(fs.existsSync('./'+f),'Missing precache asset '+f)}
 console.log('PASS: install, scoped cache cleanup, online refresh, offline navigation with query, cached assets, unrelated routes bypass, complete precache');
})().catch(e=>{console.error(e);process.exit(1)});

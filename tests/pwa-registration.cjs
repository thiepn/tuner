const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('./index.html','utf8');
const code=source.slice(source.indexOf('      async function registerPwa()'),source.indexOf('      async function refreshMicrophoneDevices'));
async function run(state){
 const worker={state,addEventListener(){},removeEventListener(){}};
 const registration={active:state==='active'?{}:null,installing:worker,addEventListener(){}};
 let calls=0;const c={document:{documentElement:{dataset:state==='standalone'?{distribution:'standalone'}:{}}},window:{isSecureContext:true},navigator:{serviceWorker:{register:async()=>{calls++;return registration}}},offlineStatus:{},console:{error(){}},updateInstallUi(){},updateOfflineUi(){},offlineCacheFailed:false,serviceWorkerRegistration:null};
 vm.createContext(c);vm.runInContext(code,c);await c.registerPwa();return{c,calls};
}
(async()=>{let r=await run('redundant');assert.equal(r.c.offlineCacheFailed,true);r=await run('activated');assert(r.c.serviceWorkerRegistration);r=await run('active');assert(r.c.serviceWorkerRegistration);r=await run('standalone');assert.equal(r.calls,0);console.log('PASS: failed install reported, own worker activation, existing installation, standalone registration skipped')})().catch(e=>{console.error(e);process.exit(1)});

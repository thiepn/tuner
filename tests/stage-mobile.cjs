const fs=require('fs'),assert=require('assert/strict');
const source=fs.readFileSync('./index.html','utf8');
for(const id of ['navStageBtn','stageChrome','stageTuningName','stageTuningNotes','stageMicStatus','stageAutoBtn','stageDisplayBtn','stageMicBtn','stageExitBtn','reloadUpdateBtn']){
  assert(source.includes(`id="${id}"`),'Missing '+id);
}
for(const fn of ['initializeUiHistory','syncUiOverlay','navigateUiOverlay','syncStageControls','enterStageMode','exitStageMode','syncViewportMetrics','checkForPwaUpdate']){
  assert(source.includes('function '+fn+'(')||source.includes('async function '+fn+'('),'Missing '+fn);
}
assert(source.includes("const UI_OVERLAY_KEY = 'tunerOverlay'"));
assert(source.includes("window.addEventListener('popstate'"));
assert(source.includes("dialog.addEventListener('cancel'"));
assert(source.includes("document.addEventListener('fullscreenchange'"));
assert(source.includes("requestFullscreen({ navigationUI: 'hide' })"));
assert(source.includes("window.visualViewport?.addEventListener?.('resize'"));
assert(source.includes("body.stage-mode"));
assert(source.includes("@media(orientation:landscape) and (max-height:600px)"));
assert(source.includes("@media(max-width:360px) and (orientation:portrait)"));
assert(source.includes("wakeLockRetryTimer = setTimeout"));
assert(source.includes("navigator.serviceWorker?.addEventListener?.('controllerchange'"));
assert(source.includes("A newer app version is ready. Reload to finish updating."));
console.log('PASS: P3 Stage Mode, Android-back history, mobile viewport, wake-lock and update UX contract');

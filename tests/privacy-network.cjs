const fs=require('fs'),assert=require('assert/strict');
const index=fs.readFileSync('./index.html','utf8');
const sw=fs.readFileSync('./sw.js','utf8');

const forbidden=[
  /<script[^>]+src=["']https?:\/\//i,
  /<link[^>]+href=["']https?:\/\//i,
  /\bXMLHttpRequest\b/,
  /\bWebSocket\b/,
  /\bEventSource\b/,
  /\bsendBeacon\b/,
  /\bgtag\s*\(/i,
  /google-analytics\.com/i,
  /googletagmanager\.com/i,
  /segment\.com/i,
  /mixpanel/i,
  /sentry\.io/i,
  /firebase/i,
  /supabase/i
];
for(const pattern of forbidden) assert(!pattern.test(index),'Unexpected network/analytics pattern: '+pattern);
assert(!/\bfetch\s*\(/.test(index),'App page should not make runtime network requests');
assert(sw.includes('url.origin !== self.location.origin'),'Service worker must constrain fetch handling to same origin');
assert(!/https?:\/\//i.test(sw.replace(/\/\/.*$/gm,'')),'Service worker must not hard-code remote origins');
console.log('PASS: no third-party runtime, analytics, telemetry or app-page network calls detected');

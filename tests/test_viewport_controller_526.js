#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const controllerPath = path.join(root, 'src/js/ui/viewport-controller.js');
const source = fs.readFileSync(controllerPath, 'utf8');

function createContext({ innerWidth, innerHeight, clientWidth, clientHeight, visualWidth, visualHeight, screenWidth, screenHeight }) {
  const listeners = [];
  const html = { dataset: {} };
  const body = { dataset: {} };
  const overlay = { dataset: {} };
  const visualViewport = {
    width: visualWidth,
    height: visualHeight,
    addEventListener(type, callback) { listeners.push(['visualViewport', type, callback]); }
  };
  const windowObject = {
    innerWidth,
    innerHeight,
    screen: { width: screenWidth, height: screenHeight },
    visualViewport,
    addEventListener(type, callback) { listeners.push(['window', type, callback]); },
    requestAnimationFrame(callback) { callback(); return 1; },
    cancelAnimationFrame() {}
  };
  const documentObject = {
    documentElement: { ...html, clientWidth, clientHeight },
    body,
    readyState: 'complete',
    getElementById(id) { return id === 'vnOverlay' ? overlay : null; },
    addEventListener(type, callback) { listeners.push(['document', type, callback]); }
  };
  const context = vm.createContext({
    window: windowObject,
    document: documentObject,
    requestAnimationFrame: windowObject.requestAnimationFrame,
    cancelAnimationFrame: windowObject.cancelAnimationFrame,
    console,
    Map,
    Math,
    Number,
    Object,
    Set
  });
  vm.runInContext(source, context, { filename: 'viewport-controller.js' });
  return { context, listeners, html: documentObject.documentElement, body, overlay };
}

const profiles = [
  { size: [1536, 864], family: 'desktop' },
  { size: [1280, 800], family: 'compact-desktop' },
  { size: [1024, 600], family: 'short-landscape' },
  { size: [820, 1180], family: 'portrait-tablet' },
  { size: [430, 932], family: 'standard-phone' },
  { size: [375, 667], family: 'compact-phone' }
];

for (const profile of profiles) {
  const [width, height] = profile.size;
  const { context } = createContext({
    innerWidth: width,
    innerHeight: height,
    clientWidth: width,
    clientHeight: height,
    visualWidth: width,
    visualHeight: height,
    screenWidth: width,
    screenHeight: height
  });
  assert.strictEqual(context.pcGetViewportFamily(), profile.family, `${width}x${height}`);
}

const emulated = createContext({
  innerWidth: 1024,
  innerHeight: 1366,
  clientWidth: 1024,
  clientHeight: 1366,
  visualWidth: 1024,
  visualHeight: 1366,
  screenWidth: 768,
  screenHeight: 1024
});
const metrics = emulated.context.pcGetViewportMetrics();
assert.strictEqual(metrics.layoutWidth, 1024);
assert.strictEqual(metrics.layoutHeight, 1366);
assert.strictEqual(metrics.emulatedWidth, 768);
assert.strictEqual(metrics.emulatedHeight, 1024);
assert.strictEqual(metrics.modalWidth, 768);
assert.strictEqual(metrics.modalHeight, 1024);
assert.strictEqual(
  emulated.context.pcViewportMatchesExactProfiles([[768, 1024]], metrics),
  true
);

const eventKeys = emulated.listeners.map(([owner, type]) => `${owner}:${type}`);
assert.deepStrictEqual(eventKeys.filter(key => key.startsWith('window:')).sort(), [
  'window:orientationchange',
  'window:resize'
]);
assert.deepStrictEqual(eventKeys.filter(key => key.startsWith('visualViewport:')), [
  'visualViewport:resize'
]);

const applicationSources = fs.readdirSync(path.join(root, 'src/js'), { recursive: true })
  .filter(name => name.endsWith('.js'))
  .filter(name => name !== 'ui/viewport-controller.js')
  .filter(name => name !== 'pages/ideas-wall.js')
  .map(name => [name, fs.readFileSync(path.join(root, 'src/js', name), 'utf8')]);

for (const [name, fileSource] of applicationSources) {
  assert.ok(!/window\.addEventListener\(['"](?:resize|orientationchange)['"]/.test(fileSource), `${name} owns a window viewport listener`);
  assert.ok(!/visualViewport\?\.addEventListener\(['"]resize['"]/.test(fileSource), `${name} owns a visual viewport listener`);
  assert.ok(!/window\.(?:innerWidth|innerHeight)/.test(fileSource), `${name} reads window viewport dimensions directly`);
  assert.ok(!/window\.screen\??\.(?:width|height)/.test(fileSource), `${name} reads screen dimensions directly`);
  assert.ok(!/document\.documentElement\??\.(?:clientWidth|clientHeight)/.test(fileSource), `${name} reads document viewport dimensions directly`);
  assert.ok(!/window\.visualViewport\??\.(?:width|height)/.test(fileSource), `${name} reads visual viewport dimensions directly`);
}

for (const subscriber of [
  'responsive-chrome',
  's1-cast-room',
  's1-evidence-modal',
  'live-analysis',
  'completed-analysis',
  'prediction-presentation',
  'modern-terminal-alignment'
]) {
  const allSource = applicationSources.map(([, fileSource]) => fileSource).join('\n');
  assert.ok(allSource.includes(`pcSubscribeViewport('${subscriber}'`), `missing subscriber: ${subscriber}`);
}

console.log('Viewport controller 526 metrics, profiles, and single-listener contract passed.');

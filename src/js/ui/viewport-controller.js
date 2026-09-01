/* PROMPTCRAFT VIEWPORT CONTROLLER
   Owns viewport measurements, viewport-family classification, exact device
   profile matching, and the application's single resize/orientation pipeline. */

const PC_VIEWPORT_SUBSCRIBERS = new Map();
let pcViewportUpdateFrame = 0;
let pcViewportRevision = 0;

function pcPositiveViewportValue(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function pcSmallestViewportValue(values, fallback = 0) {
  const usable = values.map(pcPositiveViewportValue).filter(value => value !== null);
  return usable.length ? Math.min(...usable) : fallback;
}

function pcGetViewportMetrics() {
  const innerWidth = pcPositiveViewportValue(window.innerWidth);
  const innerHeight = pcPositiveViewportValue(window.innerHeight);
  const clientWidth = pcPositiveViewportValue(document.documentElement?.clientWidth);
  const clientHeight = pcPositiveViewportValue(document.documentElement?.clientHeight);
  const visualWidth = pcPositiveViewportValue(window.visualViewport?.width);
  const visualHeight = pcPositiveViewportValue(window.visualViewport?.height);
  const screenWidth = pcPositiveViewportValue(window.screen?.width);
  const screenHeight = pcPositiveViewportValue(window.screen?.height);

  const fallbackWidth = innerWidth || clientWidth || visualWidth || screenWidth || 0;
  const fallbackHeight = innerHeight || clientHeight || visualHeight || screenHeight || 0;
  const layoutWidth = pcSmallestViewportValue(
    [innerWidth, clientWidth, visualWidth],
    fallbackWidth
  );
  const layoutHeight = pcSmallestViewportValue(
    [innerHeight, clientHeight, visualHeight],
    fallbackHeight
  );

  // DevTools device emulation can report a scaled inner viewport that is
  // larger than the selected screen. Preserve the smaller emulated dimension.
  const emulatedWidth = pcSmallestViewportValue(
    [innerWidth, screenWidth || innerWidth],
    fallbackWidth
  );
  const emulatedHeight = pcSmallestViewportValue(
    [innerHeight, screenHeight || innerHeight],
    fallbackHeight
  );

  // Full-size evidence previously bounded itself by inner, visual, and screen
  // dimensions. Keep that exact policy named rather than re-deriving it.
  const modalWidth = pcSmallestViewportValue(
    [innerWidth, visualWidth || innerWidth, screenWidth || innerWidth],
    fallbackWidth
  );
  const modalHeight = pcSmallestViewportValue(
    [innerHeight, visualHeight || innerHeight, screenHeight || innerHeight],
    fallbackHeight
  );

  return Object.freeze({
    revision: pcViewportRevision,
    innerWidth,
    innerHeight,
    clientWidth,
    clientHeight,
    visualWidth,
    visualHeight,
    screenWidth,
    screenHeight,
    layoutWidth,
    layoutHeight,
    emulatedWidth,
    emulatedHeight,
    modalWidth,
    modalHeight,
    maxDocumentWidth: Math.max(innerWidth || 0, clientWidth || 0) || layoutWidth,
    maxDocumentHeight: Math.max(innerHeight || 0, clientHeight || 0) || layoutHeight,
    preferredWidth: visualWidth || clientWidth || innerWidth || 1920,
    preferredHeight: visualHeight || clientHeight || innerHeight || 1080,
    screenReportWidth: innerWidth || screenWidth,
    reportedWidth: innerWidth || clientWidth || screenWidth || '',
    exactSizeCandidates: Object.freeze([
      Object.freeze([screenWidth, screenHeight]),
      Object.freeze([innerWidth, innerHeight]),
      Object.freeze([clientWidth, clientHeight])
    ])
  });
}

function pcViewportHeight(metrics = pcGetViewportMetrics()) {
  return metrics.layoutHeight || window.innerHeight;
}

function pcGetViewportWidth(metrics = pcGetViewportMetrics()) {
  return metrics.layoutWidth || window.innerWidth;
}

function pcGetViewportFamily(metrics = pcGetViewportMetrics()) {
  const width = pcGetViewportWidth(metrics);
  const height = pcViewportHeight(metrics);
  const aspectRatio = width / Math.max(height, 1);

  // Width participates before height so a 1024 × 600 display is not treated
  // as a phone and given phone smartboard geometry.
  if (width >= 760 && height <= 720) return 'short-landscape';
  if (width <= 380 || (width <= 560 && height <= 720)) return 'compact-phone';
  if (width <= 560) return 'standard-phone';
  if (width <= 1100 && aspectRatio < 0.9) return 'portrait-tablet';
  if (width <= 1400 && height <= 950) return 'compact-desktop';
  return 'desktop';
}

function pcApplyViewportFamily(metrics = pcGetViewportMetrics()) {
  const family = pcGetViewportFamily(metrics);
  const html = document.documentElement;
  const body = document.body;
  const overlay = document.getElementById('vnOverlay');

  if (html) html.dataset.pcViewportFamily = family;
  if (body) body.dataset.pcViewportFamily = family;
  if (overlay) overlay.dataset.pcViewportFamily = family;
  return family;
}

function pcViewportMatchesExactProfiles(profiles = [], metrics = pcGetViewportMetrics()) {
  return profiles.some(([profileWidth, profileHeight]) =>
    metrics.exactSizeCandidates.some(([width, height]) =>
      Math.round(Number(width)) === profileWidth && Math.round(Number(height)) === profileHeight
    )
  );
}

function pcSubscribeViewport(name, callback, { immediate = false } = {}) {
  const key = String(name || '').trim();
  if (!key || typeof callback !== 'function') return () => {};
  PC_VIEWPORT_SUBSCRIBERS.set(key, callback);
  if (immediate) pcScheduleViewportUpdate();
  return () => PC_VIEWPORT_SUBSCRIBERS.delete(key);
}

function pcDispatchViewportUpdate() {
  pcViewportRevision += 1;
  const metrics = pcGetViewportMetrics();
  pcApplyViewportFamily(metrics);
  PC_VIEWPORT_SUBSCRIBERS.forEach((callback, name) => {
    try {
      callback(metrics);
    } catch (error) {
      console.error(`[PromptCraft] viewport subscriber failed: ${name}`, error);
    }
  });
  return metrics;
}

function pcScheduleViewportUpdate() {
  if (pcViewportUpdateFrame) cancelAnimationFrame(pcViewportUpdateFrame);
  pcViewportUpdateFrame = requestAnimationFrame(() => {
    pcViewportUpdateFrame = 0;
    pcDispatchViewportUpdate();
  });
}

if (!window.pcViewportControllerInstalled) {
  window.pcViewportControllerInstalled = true;
  window.addEventListener('resize', pcScheduleViewportUpdate, { passive: true });
  window.addEventListener('orientationchange', pcScheduleViewportUpdate, { passive: true });
  window.visualViewport?.addEventListener('resize', pcScheduleViewportUpdate, { passive: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pcScheduleViewportUpdate, { once: true });
  } else {
    pcScheduleViewportUpdate();
  }
}

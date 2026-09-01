# Phase 3 viewport ownership

Phase 3 consolidates application viewport measurement and resize delivery in
browser/cache patch 526. It does not change CSS, breakpoints, visual design,
gameplay, dialogue, tracking schema, AI contracts, or accessibility behavior.

## Central owner

`src/js/ui/viewport-controller.js` is loaded before its consumers. It owns:

- reads of window, document, visual viewport, and screen dimensions;
- viewport-family classification and the `data-pc-viewport` root attribute;
- exact documented device-profile matching;
- the application's one window resize listener, one orientation listener, and
  one visual viewport resize listener;
- requestAnimationFrame batching and named subscriber delivery.

The public Ideas Wall is intentionally outside this controller. `wall.html`
loads a standalone page bundle, so `src/js/pages/ideas-wall.js` retains its
page-local resize listener.

## Metric policy

| Metric | Preserved policy | Primary consumers |
|---|---|---|
| Layout width/height | Minimum positive inner, document, and visual viewport size | Family classification and responsive application chrome |
| Emulated width/height | Minimum positive inner and screen size | S1 Canvas evidence and adaptive cast |
| Modal width/height | Minimum positive inner, visual viewport, and screen size | S1 full-size evidence modal |
| Maximum document size | Maximum inner and document size | Workstation custom properties |
| Preferred size | Visual viewport, then document, then inner viewport | Prediction presentation |
| Reported width | Existing inner/document/screen fallback order | V121 tracking payload |
| Screen report width | Existing inner/screen fallback order | Connection diagnostic payload |

The S1 Read Size default remains an exact-match table for 853x1280, 912x1368,
1024x1366, 820x1180, and 768x1024 profiles. It is a gameplay-facing device
default, not a new breakpoint.

## Subscriber ownership

| Subscriber | DOM behavior it still owns |
|---|---|
| `responsive-chrome` | Workstation and application chrome custom properties |
| `s1-cast-room` | Compact Canvas cast placement |
| `s1-evidence-modal` | Evidence fit, modal layout, and Read Size default |
| `live-analysis` | Live analysis overflow layout |
| `completed-analysis` | Completed analysis layout |
| `prediction-presentation` | Prediction-gate presentation geometry |
| `modern-terminal-alignment` | Completed CRT terminal alignment |

Content and mutation observers remain local to their components because they
react to DOM state rather than viewport state. Local scheduling helpers also
remain where non-viewport events use them.

## Regression boundary

`tests/test_viewport_controller_526.js` verifies the metric contract,
documented viewport families, device-emulation behavior, exact-profile match,
listener exclusivity, and required subscribers. Existing responsive and
scenario tests continue to guard the DOM behaviors owned by each subscriber.

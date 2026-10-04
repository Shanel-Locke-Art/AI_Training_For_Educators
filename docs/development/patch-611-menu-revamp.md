# Patch 611: Main menu revamp

Apply over Patch 610. Application V429, research schema V121, receiver V94 and asset manifest v153 remain unchanged.

All six menu panels share persistent section navigation, an active-section indicator, blue-and-gold cards, consistent typography, and one scrolling content area between the header/navigation and footer. Home now presents a concise course-design invitation, primary start/continue action, scenario selection, Ideas Wall, saved course guide, device QR and retained data notice. Scenario availability text now describes the actual S1/S2 availability; later scenarios remain locked.

About features Shanel's unchanged full portrait beside her biography on larger screens and above it on phones. Supporting project, academic and disclaimer cards flow below. Research and privacy wording is retained. Babbage retains its existing historical illustration and explanation.

`src/css/ui/main-menu.css` is the final menu presentation owner, scoped to `#mainMenuOverlay`. Existing legacy base menu styles remain as fallback; gameplay and the immersive reader are outside this scope. Panel switching updates the navigation state and resets the new panel's scroll position while retaining existing focus behavior.

Validation: synchronized build, structural validation, CSS/asset audits; all six menu panels at 1440x1000, 820x1180 and 390x844 with keyboard navigation, current-section state, scrolling, portrait load/aspect ratio, scenario locks and viewport-fit checks. Rendered screenshots reviewed. Full S1 flow and S2 repair/persistence/isolation regressions passed on those three viewport sizes with external services blocked. Live hosted AI/research services were not exercised by these local tests.

Only files listed in patch-611-changed-files.txt are exported. No scenario content or S3 implementation is added.

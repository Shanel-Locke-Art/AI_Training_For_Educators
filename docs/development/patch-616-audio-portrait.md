# Patch 616: Audio setup portrait

Apply over Patch 615. Application V429, research schema V121, receiver V94 and asset manifest v156 remain unchanged.

The supplied screenshot shows the separate audio-preference dialog portrait, rather than the narrative cast portrait adjusted in Patch 615. This dialog now uses Pixel's existing neutral v3 expression, with its matching neutral fallback. No new image asset is generated.

Pixel's portrait is inset below the dialog's top border. Responsive crop heights keep the portrait clear of the full-width help text at desktop, tablet, phone and short-landscape sizes. The change is scoped to the audio dialog; narrative framing is unchanged.

Playwright verification at 1440x1000, 1424x736, 1024x600, 820x1180 and 390x844 checks image loading, neutral expression, top inset, clearance above help text, no horizontal overflow, all three audio selections, reachable controls and handoff into the story. Representative dialog screenshots reviewed. External requests are blocked; these checks do not verify live recorded audio. Build synchronization, structural validation, CSS audit and asset audit pass.

Only entries in patch-616-changed-files.txt are exported.

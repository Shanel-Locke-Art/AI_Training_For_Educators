# Patch 628: menu navigation and Babbage headroom

Apply over Patch 627. Removed five redundant Main Menu return buttons from submenu headings. The persistent Home navigation item provides the return path. Opening a panel focuses its heading without scrolling, so removing the return button does not cause phone users to skip the introduction. Babbage's About portrait gains 14px of additional top spacing, with bottom-aligned contained artwork. The frame grows by 14px to preserve portrait space. Explicit contain sizing replaces an inherited square cover crop that clipped the head. Logo artwork is unchanged.

Verified desktop, tablet and phone menu navigation, keyboard access, scrolling, viewport fit, removal of duplicate return buttons and portrait spacing. Structural validation, CSS/asset audits and source/runtime synchronization pass.

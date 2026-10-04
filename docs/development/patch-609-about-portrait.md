# Patch 609: About PromptCraft portrait

Apply over Patch 608. Adds the user-supplied, unchanged `shanel_profile.jpg` to the
Developer card on the main menu's About PromptCraft panel. The full portrait appears
beside the developer name on wide screens and above it on phones, with descriptive
alt text and a gold border. The existing biography and links remain unchanged.

App V429, research V121 and receiver V94 remain unchanged. The asset manifest becomes
v153 to register the new runtime image. No scenario or gameplay code changes.

Verified photo loading, full aspect ratio, alternative text, menu return, and no
horizontal overflow or page errors at desktop, tablet and phone sizes. Build/runtime
synchronization, structural validation and asset audit pass.

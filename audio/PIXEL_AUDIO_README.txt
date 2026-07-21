Professor Pixel line-by-line audio

Place recorded MP3 files here:

  audio/pixel/p1.mp3
  audio/pixel/p2.mp3
  audio/pixel/p3.mp3
  ...

The game now reads the `id` field in functions/dialogue.js and plays the matching file.
For hard-coded Pixel lines still inside functions/app.js, the game uses window.pixelAudioByText as a fallback.

Recommended workflow:
1. Record each line from the manifest.
2. Export each file as its p# filename.
3. Put all files in audio/pixel/.
4. Deploy the site.

If a file is missing, the game will continue without crashing and will log a warning in the console.

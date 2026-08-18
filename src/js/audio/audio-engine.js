// ══════════════════════════════════════════════════════
//  AUDIO
//  Runtime voice and music files are organized under assets/audio/
// ══════════════════════════════════════════════════════
const audioReady = typeof Howl !== 'undefined';
const sounds = audioReady ? {
  welcome:           new Howl({ src: [ASSETS.audio.professorPixel.welcome],          volume: 0.9 }),
  vague:             new Howl({ src: [ASSETS.audio.professorPixel.vague],            volume: 0.9 }),
  decent:            new Howl({ src: [ASSETS.audio.professorPixel.decent],           volume: 0.9 }),
  strong:            new Howl({ src: [ASSETS.audio.professorPixel.strong],           volume: 0.9 }),
  scenarioComplete:  new Howl({ src: [ASSETS.audio.professorPixel.scenarioComplete], volume: 0.9 }),
  allComplete:       new Howl({ src: [ASSETS.audio.professorPixel.allComplete],      volume: 0.9 }),
  scenarioIntro0:    new Howl({ src: [ASSETS.audio.professorPixel.scenarioIntro0],   volume: 0.9 }),
  reflectionOpen:    new Howl({ src: [ASSETS.audio.professorPixel.reflectionOpen],   volume: 0.9 })
} : {};

// Narration sounds should not overlap one another.
const NARRATION_KEYS = new Set(['welcome','vague','decent','strong','scenarioComplete','allComplete','scenarioIntro0','reflectionOpen']);
let _currentNarration = null;

function playSound(name) {
  if (!audioPreferences.voicesEnabled || !audioReady || !sounds[name]) return;
  if (NARRATION_KEYS.has(name)) {
    if (_currentNarration && _currentNarration !== sounds[name]) _currentNarration.stop();
    _currentNarration = sounds[name];
  }
  sounds[name].play();
}

// ── BACKGROUND MUSIC SYSTEM ───────────────────────────
const MUSIC_VOL_VN   = 0.35;
const MUSIC_VOL_GAME = 0.08;
const MUSIC_FADE_MS  = 2000;

let bgMusic = null;
let musicPlaybackStarted = false;
let musicReady = false;

function initMusic() {
  if (bgMusic || !audioPreferences.musicEnabled || typeof Howl === 'undefined') return;
  bgMusic = new Howl({
    src: [ASSETS.audio.music.background],
    loop: true,
    volume: 0,
    html5: true,
    onload: () => { musicReady = true; },
    onloaderror: () => { bgMusic = null; }
  });
}

function musicFadeTo(targetVol, durationMs) {
  if (!audioPreferences.musicEnabled || !bgMusic) return;
  bgMusic.fade(bgMusic.volume(), targetVol, durationMs);
}

function musicStartVN() {
  if (!audioPreferences.musicEnabled) return;
  initMusic();
  if (!bgMusic) return;

  if (!musicPlaybackStarted) {
    musicPlaybackStarted = true;
    bgMusic.play();
    bgMusic.volume(0);
  }
  musicFadeTo(MUSIC_VOL_VN, MUSIC_FADE_MS);
}

function musicEndVN() {
  if (!audioPreferences.musicEnabled) return;
  musicFadeTo(MUSIC_VOL_GAME, MUSIC_FADE_MS);
}

function stopAutomaticNarration() {
  if (_currentNarration) {
    try { _currentNarration.stop(); } catch (error) {}
    _currentNarration = null;
  }
  Object.values(sounds).forEach(sound => {
    try { sound.stop(); } catch (error) {}
  });
}

function stopBackgroundMusic() {
  if (!bgMusic) return;
  try {
    bgMusic.fade(bgMusic.volume(), 0, 350);
    setTimeout(() => {
      try { bgMusic.pause(); } catch (error) {}
      musicPlaybackStarted = false;
    }, 380);
  } catch (error) {
    try { bgMusic.pause(); } catch (_) {}
    musicPlaybackStarted = false;
  }
}

function updateAudioSettingsButton() {
  const btn = document.getElementById('musicToggle');
  if (!btn) return;

  const icon = pcAudioMode === 'full' ? '🔊' : pcAudioMode === 'voices' ? '🗣️' : '🔇';
  const label = getAudioModeLabel();
  btn.textContent = icon;
  btn.classList.toggle('muted', pcAudioMode === 'silent');
  btn.classList.toggle('voices-only', pcAudioMode === 'voices');
  btn.classList.toggle('full-audio', pcAudioMode === 'full');
  btn.setAttribute('aria-label', `Open audio settings. Current setting: ${label}`);
  btn.title = `Audio settings: ${label}`;
}

function applyAudioMode(mode) {
  const validMode = ['full', 'voices', 'silent'].includes(mode) ? mode : 'silent';
  pcAudioMode = validMode;
  audioPreferences.voicesEnabled = validMode === 'full' || validMode === 'voices';
  audioPreferences.musicEnabled = validMode === 'full';

  if (!audioPreferences.voicesEnabled) stopAutomaticNarration();

  if (!audioPreferences.musicEnabled) {
    stopBackgroundMusic();
  } else {
    initMusic();

    // Begin the music stream at zero volume during the learner's explicit
    // selection click. This satisfies browser audio-unlock rules without
    // making noise before the scenario opens.
    if (bgMusic && !musicPlaybackStarted) {
      musicPlaybackStarted = true;
      bgMusic.play();
      bgMusic.volume(0);
    }

    if (pcScenarioHasLaunched) {
      const vnIsOpen = document.getElementById('vnOverlay')?.classList.contains('active');
      if (vnIsOpen) musicStartVN();
      else musicFadeTo(MUSIC_VOL_GAME, 600);
    }
  }

  updateAudioSettingsButton();
}


// ══════════════════════════════════════════════════════

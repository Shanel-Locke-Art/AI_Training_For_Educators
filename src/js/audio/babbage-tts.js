/* Babbage analysis text-to-speech. DOM IDs retain babbage* names for CSS/markup compatibility. */
let babbageSpeechUtterance = null;

  function cleanBabbageSpeechText(text) {
    return String(text || '')
      .replace(/\*\*/g, '')
      .replace(/#/g, '')
      .replace(/[-]{3,}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

function toggleBabbageTTS() {
    const btn = document.getElementById('babbageTTSBtn');

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      if (btn) btn.textContent = '🔊 Read Analysis';
      return;
    }

    const output = document.getElementById('babbageTerminalOutput');
    const text = cleanBabbageSpeechText(output?.textContent || '');

    if (!text) return;

    babbageSpeechUtterance = new SpeechSynthesisUtterance(text);
    babbageSpeechUtterance.rate = 0.9;
    babbageSpeechUtterance.pitch = 0.85;

    babbageSpeechUtterance.onend = () => {
      if (btn) btn.textContent = '🔊 Read Analysis';
    };

    babbageSpeechUtterance.onerror = () => {
      if (btn) btn.textContent = '🔊 Read Analysis';
    };

    if (btn) btn.textContent = '⏹ Stop Reading';
    window.speechSynthesis.speak(babbageSpeechUtterance);
  }

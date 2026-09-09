// Sound migrated from the Python reference (old/game/settings.py + main.py's
// start_background_music/load_sound_effect/play_sound). Same files, same
// volumes (bgm 0.5, sfx 0.7). A missing file or a browser that blocks
// autoplay before a user gesture must never crash the game -- every call
// here is wrapped so playback failures are silently ignored, same as the
// Python version's `except pygame.error: return None` fallback.
const SOUNDS_BASE = '/puzzle-classic/sounds';
const BGM_VOLUME = 0.5;
const SFX_VOLUME = 0.7;

function createAudio(filename, { loop = false, volume = SFX_VOLUME } = {}) {
  try {
    const audio = new Audio(`${SOUNDS_BASE}/${filename}`);
    audio.loop = loop;
    audio.volume = volume;
    return audio;
  } catch {
    return null;
  }
}

function safePlay(audio) {
  if (!audio) return;
  try {
    audio.currentTime = 0;
    const result = audio.play();
    if (result && typeof result.catch === 'function') {
      result.catch(() => {});
    }
  } catch {
    // ignore -- e.g. blocked by the browser's autoplay policy
  }
}

export function createAudioController() {
  const bgm = createAudio('bgm.wav', { loop: true, volume: BGM_VOLUME });
  const sfxCorrect = createAudio('catch_correct.wav');
  const sfxWrong = createAudio('catch_wrong.wav');
  const sfxLevelComplete = createAudio('level_complete.wav');
  const sfxClick = createAudio('click.wav');

  let bgmStarted = false;

  return {
    // Call on the first user gesture (browsers block audio before one).
    // Safe to call repeatedly -- only actually starts playback once.
    startBgmOnce() {
      if (bgmStarted || !bgm) return;
      bgmStarted = true;
      safePlay(bgm);
    },
    pauseBgm() {
      if (bgm && !bgm.paused) bgm.pause();
    },
    resumeBgm() {
      if (bgmStarted) safePlay(bgm);
    },
    playCorrect: () => safePlay(sfxCorrect),
    playWrong: () => safePlay(sfxWrong),
    playLevelComplete: () => safePlay(sfxLevelComplete),
    playClick: () => safePlay(sfxClick),
  };
}

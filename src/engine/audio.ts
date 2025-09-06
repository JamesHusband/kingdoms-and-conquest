// For now, we'll use a simple audio system with HTML5 Audio
// PIXI.js v8 audio system is more complex and requires additional setup

export type AudioState = {
  musicVolume: number;
  sfxVolume: number;
  currentMusic: HTMLAudioElement | null;
  sounds: Map<string, HTMLAudioElement>;
};

export function createAudioState(): AudioState {
  return {
    musicVolume: 0.7,
    sfxVolume: 0.8,
    currentMusic: null,
    sounds: new Map(),
  };
}

export function loadSound(
  state: AudioState,
  name: string,
  url: string
): Promise<AudioState> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.addEventListener("canplaythrough", () => {
      const newSounds = new Map(state.sounds);
      newSounds.set(name, audio);
      resolve({
        ...state,
        sounds: newSounds,
      });
    });
    audio.addEventListener("error", () => {
      reject(new Error(`Failed to load sound: ${name}`));
    });
    audio.load();
  });
}

export function playMusic(state: AudioState, musicName: string): AudioState {
  // Stop current music
  if (state.currentMusic) {
    state.currentMusic.pause();
    state.currentMusic.currentTime = 0;
  }

  const music = state.sounds.get(musicName);
  if (music) {
    music.volume = state.musicVolume;
    music.loop = true;
    music.play().catch(console.error);
  }

  return {
    ...state,
    currentMusic: music || null,
  };
}

export function playSound(state: AudioState, soundName: string): AudioState {
  const sound = state.sounds.get(soundName);
  if (sound) {
    sound.volume = state.sfxVolume;
    sound.currentTime = 0; // Reset to beginning
    sound.play().catch(console.error);
  }
  return state;
}

export function setMusicVolume(state: AudioState, volume: number): AudioState {
  if (state.currentMusic) {
    state.currentMusic.volume = volume;
  }
  return {
    ...state,
    musicVolume: volume,
  };
}

export function setSfxVolume(state: AudioState, volume: number): AudioState {
  return {
    ...state,
    sfxVolume: volume,
  };
}

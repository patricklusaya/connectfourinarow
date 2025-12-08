// Sound effect generator using Web Audio API

const createTone = (frequency: number, duration: number, type: OscillatorType = 'sine'): void => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug('Audio context not available');
  }
};

export const playDropSound = (): void => {
  // Short, pleasant drop sound
  createTone(400, 0.1, 'sine');
  setTimeout(() => createTone(350, 0.1, 'sine'), 50);
};

export const playWinSound = (): void => {
  // Victory fanfare
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (major chord)
  notes.forEach((freq, index) => {
    setTimeout(() => {
      createTone(freq, 0.3, 'sine');
    }, index * 100);
  });
};

export const playDrawSound = (): void => {
  // Neutral sound for draw
  createTone(300, 0.2, 'sine');
  setTimeout(() => createTone(250, 0.2, 'sine'), 100);
};


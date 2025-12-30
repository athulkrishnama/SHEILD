/**
 * Play hero theme music
 * @param heroName - Name of the hero
 */
export const playHeroMusic = (heroName: string): void => {
  try {
    // Convert hero name to filename format
    // e.g., "Spider-Man" -> "spider-man"
    const filename = heroName.toLowerCase().replace(/\s+/g, "-");

    // Create audio element
    const audio = new Audio(`/audio/heroes/${filename}.mp3`);

    // Set volume
    audio.volume = 0.5;

    // Play the audio
    audio.play().catch((error) => {
      console.warn(`Could not play audio for ${heroName}:`, error);
      // Silently fail if audio file doesn't exist
    });

    // Clean up after playback
    audio.onended = () => {
      audio.remove();
    };
  } catch (error) {
    console.warn(`Error playing hero music for ${heroName}:`, error);
  }
};

/**
 * Preload hero audio files for faster playback
 * @param heroNames - Array of hero names to preload
 */
export const preloadHeroMusic = (heroNames: string[]): void => {
  heroNames.forEach((heroName) => {
    const filename = heroName.toLowerCase().replace(/\s+/g, "-");
    const audio = new Audio(`/audio/heroes/${filename}.mp3`);
    audio.preload = "auto";
  });
};

/**
 * Stop all currently playing audio
 */
export const stopAllAudio = (): void => {
  const audioElements = document.querySelectorAll("audio");
  audioElements.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
};

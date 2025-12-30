/**
 * Get the image URL for a hero
 * @param heroName - Name of the hero (e.g., "Superman", "Batman")
 * @returns Image URL or null if not found
 */
export function getHeroImageUrl(heroName: string): string {
  // Try different extensions
  const extensions = ["png", "jpg", "webp"];

  for (const ext of extensions) {
    const imagePath = `/images/heroes/${heroName}.${ext}`;
    return imagePath; // Return path, browser will handle 404
  }

  return `/images/heroes/${heroName}.png`; // Default to .png
}

/**
 * Get hero image with fallback
 * @param heroName - Name of the hero
 * @param fallbackEmoji - Emoji to use if image not found
 * @returns Object with image URL and whether to use fallback
 */
export function getHeroImage(
  heroName: string,
  fallbackEmoji?: string
): { src: string; alt: string; fallback: string | null } {
  return {
    src: getHeroImageUrl(heroName),
    alt: `${heroName} avatar`,
    fallback: fallbackEmoji || null,
  };
}

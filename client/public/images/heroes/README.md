# Superhero Images

This folder contains images for each superhero character.

## File Naming Convention

Images should be named using the **exact hero name** (case-sensitive) with `.png`, `.jpg`, or `.webp` extension.

### Examples:
- `Superman.png`
- `Batman.jpg`
- `Wonder Woman.webp`
- `Flash.png`
- `Aquaman.png`
- `Spider-Man.png`
- `Minnal Murali.png`
- `CID Moosa.png`

## Image Format

- **Recommended size**: 200x200px to 400x400px
- **Format**: PNG (transparent background preferred), JPG, or WebP
- **Aspect ratio**: Square (1:1) recommended
- **File size**: Keep under 200KB for better performance

## Usage

The images will be displayed in:
- Hero celebration animations when a hero is assigned
- Hero status panel in the dashboard
- Recommendation cards

## Adding New Heroes

When adding a new hero image:
1. Name the file exactly as the hero name appears in the database
2. Place it in this `client/public/images/heroes/` folder
3. The application will automatically load it using the hero's name

## Fallback

If a hero image is not found, the application will display:
- The hero emoji (from HeroStatusPanel)
- Or a default placeholder

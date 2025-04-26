# SQL Jungle Adventure Game - Image Organization

This directory contains the images used in the SQL Jungle Adventure Game. The images are organized into subdirectories based on their purpose.

## Directory Structure

- `/character` - Generic character-related images
- `/eduguide` - EduGuide (main character) images:
  - `eduguide-idle.png` - Standing/default pose
  - `eduguide-ready.png` - Adventure-ready pose
  - `eduguide-victory.png` - Celebrating/victory pose
  - `eduguide-thinking.png` - Thinking/puzzled pose

## Image Sources

All images should be free to use (such as from Unsplash) or custom created. Please ensure you have the rights to use any images placed in this directory.

## Recommended Specifications

- Character images: PNG format with transparent backgrounds
- World/background images: High quality (at least 1920px width) for good appearance
- Monster images: Square aspect ratio works best for the circular display frames

## Remote vs. Local Images

- Images in the `game-images.ts` file that use absolute URLs (https://...) are loaded directly from external sources
- Images referenced with relative paths (e.g., "/sql-game/character/...") need to be stored in this directory structure

## Adding New Images

When adding new images:

1. Place the image in the appropriate subdirectory
2. Update the `game-images.ts` file with the correct path
3. Use descriptive file names that match their purpose

## Note for Developers

When updating images, please ensure they maintain thematic consistency with the jungle/adventure theme and match the SQL concept they represent. 
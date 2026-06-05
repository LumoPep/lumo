const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function removeWhiteBackground(inputPath, outputPath) {
  console.log(`Processing ${path.basename(inputPath)}...`);

  try {
    // Use sharp's built-in chroma key functionality
    await sharp(inputPath)
      .removeAlpha() // First remove any existing alpha
      .ensureAlpha() // Add alpha channel
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        // Process pixels
        const channels = 4;
        const threshold = 30;

        for (let i = 0; i < data.length; i += channels) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Check if pixel is near white
          if (r >= 255 - threshold && g >= 255 - threshold && b >= 255 - threshold) {
            data[i + 3] = 0; // Make transparent
          }
        }

        return sharp(data, {
          raw: {
            width: info.width,
            height: info.height,
            channels: 4
          }
        })
        .png()
        .toFile(outputPath);
      });

    console.log(`  ✓ Saved to ${path.basename(outputPath)}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error:`, error.message);
    return false;
  }
}

async function main() {
  const imagesDir = path.join(__dirname, '../public/images');
  const inputPath = path.join(imagesDir, 'vial-transparent.webp');
  const outputPath = path.join(imagesDir, 'vial-transparent.png');

  console.log('Removing white background from vial image...\n');

  if (!fs.existsSync(inputPath)) {
    console.log('  ✗ vial-transparent.webp not found');
    process.exit(1);
  }

  const success = await removeWhiteBackground(inputPath, outputPath);

  if (success) {
    fs.unlinkSync(inputPath);
    console.log(`\n✓ Deleted ${path.basename(inputPath)}`);
    console.log('✓ Complete!');
  }
}

main();

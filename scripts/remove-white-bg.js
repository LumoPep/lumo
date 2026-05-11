const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, '../public/images/products');

async function removeWhiteBackground(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Get raw pixel data
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Process pixels to make white transparent
    const pixelArray = new Uint8Array(data);
    const threshold = 250; // Consider pixels above this as white

    for (let i = 0; i < pixelArray.length; i += 4) {
      const r = pixelArray[i];
      const g = pixelArray[i + 1];
      const b = pixelArray[i + 2];

      // If pixel is very close to white, make it transparent
      if (r >= threshold && g >= threshold && b >= threshold) {
        pixelArray[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }

    // Create new image from processed pixels
    await sharp(pixelArray, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);

    console.log(`✓ Processed: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`✗ Error processing ${path.basename(inputPath)}:`, error.message);
  }
}

async function processAllImages() {
  console.log('Starting white background removal...\n');

  // Read all PNG files in the products directory
  const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.png'));

  console.log(`Found ${files.length} PNG files to process\n`);

  // Process each file
  for (const file of files) {
    const inputPath = path.join(productsDir, file);
    const outputPath = path.join(productsDir, file);

    await removeWhiteBackground(inputPath, outputPath);
  }

  console.log('\n✓ All images processed successfully!');
}

processAllImages().catch(console.error);

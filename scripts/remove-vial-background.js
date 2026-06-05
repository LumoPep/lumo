const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// White color to remove
const WHITE_COLOR = { r: 255, g: 255, b: 255 };
const TOLERANCE = 30;

async function removeWhiteBackground(inputPath, outputPath) {
  console.log(`Processing ${path.basename(inputPath)}...`);

  try {
    // Read the image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Get raw pixel data
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Process pixels to remove white background
    const pixelArray = new Uint8ClampedArray(data);

    // Helper function to check if a color is similar to white
    const isSimilarToWhite = (r, g, b) => {
      const dr = Math.abs(r - WHITE_COLOR.r);
      const dg = Math.abs(g - WHITE_COLOR.g);
      const db = Math.abs(b - WHITE_COLOR.b);
      return dr <= TOLERANCE && dg <= TOLERANCE && db <= TOLERANCE;
    };

    // Flood fill from corners to find white background pixels
    const width = info.width;
    const height = info.height;
    const channels = info.channels;

    const toRemove = new Set();
    const queue = [];

    // Add corner pixels to queue
    const corners = [
      [0, 0], // top-left
      [width - 1, 0], // top-right
      [0, height - 1], // bottom-left
      [width - 1, height - 1] // bottom-right
    ];

    // Also add edge pixels
    for (let x = 0; x < width; x += 3) {
      corners.push([x, 0]); // top edge
      corners.push([x, height - 1]); // bottom edge
    }
    for (let y = 0; y < height; y += 3) {
      corners.push([0, y]); // left edge
      corners.push([width - 1, y]); // right edge
    }

    // Flood fill from each starting point
    corners.forEach(([x, y]) => {
      const idx = (y * width + x) * channels;
      const r = pixelArray[idx];
      const g = pixelArray[idx + 1];
      const b = pixelArray[idx + 2];

      if (isSimilarToWhite(r, g, b)) {
        queue.push([x, y]);
      }
    });

    // BFS flood fill
    const visited = new Set();

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const idx = (y * width + x) * channels;
      const r = pixelArray[idx];
      const g = pixelArray[idx + 1];
      const b = pixelArray[idx + 2];

      if (!isSimilarToWhite(r, g, b)) continue;

      visited.add(key);
      toRemove.add(key);

      // Add neighbors to queue
      queue.push([x + 1, y]);
      queue.push([x - 1, y]);
      queue.push([x, y + 1]);
      queue.push([x, y - 1]);
    }

    console.log(`  Found ${toRemove.size} white background pixels to remove`);

    // Set alpha channel to 0 for white background pixels
    for (const key of toRemove) {
      const [x, y] = key.split(',').map(Number);
      const idx = (y * width + x) * channels;
      pixelArray[idx + 3] = 0; // Set alpha to 0
    }

    // Create new image with transparency
    await sharp(Buffer.from(pixelArray), {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);

    console.log(`  ✓ Saved to ${path.basename(outputPath)}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error processing ${path.basename(inputPath)}:`, error.message);
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
    // Delete the webp file
    fs.unlinkSync(inputPath);
    console.log(`\n✓ Deleted ${path.basename(inputPath)}`);
    console.log('✓ Background removal complete!');
  } else {
    console.log('\n✗ Background removal failed');
    process.exit(1);
  }
}

main();

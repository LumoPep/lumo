import sharp from 'sharp';

const THRESHOLD = 240;

async function removeWhiteBackground(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  await sharp(Buffer.from(data), { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);

  console.log(`✓ ${outputPath}`);
}

const base = '/Users/joshuarees/lumo-peptides/public/images';

await removeWhiteBackground(
  `${base}/vial-lineup-6.png`,
  `${base}/vial-lineup-6-transparent.png`
);

await removeWhiteBackground(
  `${base}/vial-blend-glow-klow.png`,
  `${base}/vial-blend-glow-klow-transparent.png`
);

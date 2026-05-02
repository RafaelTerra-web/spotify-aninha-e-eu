import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.join(process.cwd(), 'public', 'images');
const files = fs.readdirSync(imagesDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));

for (const file of files) {
  const fullPath = path.join(imagesDir, file);
  try {
    const metadata = await sharp(fullPath).metadata();
    const ratio = (metadata.width / metadata.height).toFixed(2);
    const orientation = metadata.width > metadata.height ? 'landscape' : metadata.width < metadata.height ? 'portrait' : 'square';
    console.log(`${file} => ${metadata.width}x${metadata.height} ratio=${ratio} (${orientation})`);
  } catch (e) {
    console.log(`${file} => ERROR: ${e.message}`);
  }
}

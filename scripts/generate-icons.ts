import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';

const SIZES = [48, 72, 96, 128, 192, 256, 384, 512];
const OUT_DIR = 'public/icons';

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const src = await sharp('assets/logo.png');
  const metadata = await src.metadata();
  console.log(`Source: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

  const results = await Promise.allSettled(
    SIZES.map(async (size) => {
      const fileName = `icon-${size}.png`;
      await src.clone().resize(size, size).toFile(`${OUT_DIR}/${fileName}`);
      return { size, fileName };
    })
  );

  for (const r of results) {
    if (r.status === 'fulfilled') {
      console.log(`  ✓ ${r.value.fileName} (${r.value.size}x${r.value.size})`);
    } else {
      console.error(`  ✗ ${r.reason}`);
    }
  }

  await src.clone().resize(32, 32).toFile('public/icon.png');
  console.log('  ✓ icon.png (32x32) — favicon');

  console.log(`\nDone — ${SIZES.length} PWA icons + favicon written.`);
}

main().catch(console.error);

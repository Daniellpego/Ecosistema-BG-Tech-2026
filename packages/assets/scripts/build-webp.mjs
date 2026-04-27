#!/usr/bin/env node
/**
 * Gera variantes WebP a partir de PNGs em packages/assets/logos/.
 * O PNG é mantido como fallback para clientes que não suportam WebP
 * (raros em 2026, mas seguro).
 *
 * Uso: npm run build:webp --workspace=@gradios/assets
 */
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, parse, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = join(__dirname, '..', 'logos');

async function main() {
  const entries = await readdir(LOGOS_DIR);
  const pngFiles = entries.filter((f) => f.toLowerCase().endsWith('.png'));

  if (pngFiles.length === 0) {
    console.log('Nenhum PNG em', LOGOS_DIR);
    return;
  }

  let totalSavedBytes = 0;
  for (const file of pngFiles) {
    const inputPath = join(LOGOS_DIR, file);
    const { name } = parse(file);
    const outputPath = join(LOGOS_DIR, `${name}.webp`);

    const inputSize = (await stat(inputPath)).size;
    await sharp(inputPath)
      .webp({ quality: 90, effort: 6 })
      .toFile(outputPath);
    const outputSize = (await stat(outputPath)).size;
    const saved = inputSize - outputSize;
    totalSavedBytes += saved;

    const pct = ((saved / inputSize) * 100).toFixed(1);
    console.log(
      `${file.padEnd(20)} ${(inputSize / 1024).toFixed(1).padStart(7)} KB → ${name}.webp ${(outputSize / 1024).toFixed(1).padStart(7)} KB  (-${pct}%)`,
    );
  }

  console.log(
    `\nTotal economizado: ${(totalSavedBytes / 1024).toFixed(1)} KB`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

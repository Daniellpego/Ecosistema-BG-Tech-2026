#!/usr/bin/env node
/**
 * Sincroniza assets compartilhados para o public/ de cada app.
 *
 * Não usa symlink (frágil em CI/Vercel) — copia os arquivos. Idempotente:
 * roda toda vez antes do build de cada app via prebuild script.
 *
 * Uso:
 *   node scripts/sync.mjs cfo
 *   node scripts/sync.mjs cto
 *   node scripts/sync.mjs site
 *   node scripts/sync.mjs all
 */
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const REPO_ROOT = join(ROOT, '..', '..');

/**
 * Mapeamento por app:
 *   - logos: arquivos copiados de packages/assets/logos/
 *   - favicons: subpasta de packages/assets/favicons/<app>/
 *   - splash: subpasta de packages/assets/splash/<app>/ (opcional)
 */
const RECIPES = {
  cfo: {
    logos: ['logo.png', 'logo.webp'],
    faviconsFrom: 'cfo',
    splashFrom: 'cfo',
  },
  cto: {
    logos: ['logo-64.png', 'logo-64.webp', 'logo-128.png', 'logo-128.webp'],
    faviconsFrom: 'cto',
    splashFrom: 'cto',
  },
  crm: {
    logos: ['logo.png', 'logo.webp'],
    faviconsFrom: null,
    splashFrom: null,
  },
  site: {
    logos: [],
    faviconsFrom: 'site',
    splashFrom: null,
  },
  servicos: {
    logos: ['logo.webp'],
    faviconsFrom: null,
    splashFrom: null,
  },
};

async function copyDir(srcDir, destDir) {
  if (!existsSync(srcDir)) return [];
  await mkdir(destDir, { recursive: true });
  const entries = await readdir(srcDir);
  const copied = [];
  for (const entry of entries) {
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, entry);
    const s = await stat(srcPath);
    if (s.isFile()) {
      await copyFile(srcPath, destPath);
      copied.push(entry);
    }
  }
  return copied;
}

async function syncApp(appName) {
  const recipe = RECIPES[appName];
  if (!recipe) {
    throw new Error(`App desconhecido: ${appName}. Conhecidos: ${Object.keys(RECIPES).join(', ')}`);
  }

  const targetPublic = join(REPO_ROOT, 'apps', appName, 'public');
  if (!existsSync(targetPublic)) {
    throw new Error(`Não existe public dir: ${targetPublic}`);
  }

  console.log(`\n• ${appName}`);

  for (const file of recipe.logos) {
    const src = join(ROOT, 'logos', file);
    if (!existsSync(src)) {
      console.warn(`  ! logo não existe: ${file}`);
      continue;
    }
    await copyFile(src, join(targetPublic, file));
    console.log(`  ✓ logo  ${file}`);
  }

  if (recipe.faviconsFrom) {
    const srcDir = join(ROOT, 'favicons', recipe.faviconsFrom);
    const copied = await copyDir(srcDir, targetPublic);
    copied.forEach((f) => console.log(`  ✓ fav   ${f}`));
  }

  if (recipe.splashFrom) {
    const srcDir = join(ROOT, 'splash', recipe.splashFrom);
    const copied = await copyDir(srcDir, targetPublic);
    copied.forEach((f) => console.log(`  ✓ splh  ${f}`));
  }
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Uso: sync.mjs <app|all>');
    console.error(`Apps: ${Object.keys(RECIPES).join(', ')}, all`);
    process.exit(1);
  }

  const targets = arg === 'all' ? Object.keys(RECIPES) : [arg];
  for (const app of targets) {
    await syncApp(app);
  }
  console.log('\nSync concluído.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

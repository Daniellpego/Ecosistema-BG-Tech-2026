#!/usr/bin/env node

/**
 * Husky Prepare Guard Script
 * Executa 'husky install' apenas se .git existir
 * Permite que npm install funcione em ambientes CI/CD sem .git (ex: Vercel)
 */

const fs = require('fs');
const { execSync } = require('child_process');

if (fs.existsSync('.git')) {
  try {
    console.log('✓ .git found - initializing husky hooks...');
    execSync('npx husky install', { stdio: 'inherit' });
    console.log('✓ Husky installed successfully.');
  } catch (e) {
    console.warn('⚠ Husky install failed:', e.message);
    process.exit(0); // Don't fail build if husky fails
  }
} else {
  console.log('ℹ No .git found - skipping husky install (CI build environment).');
}

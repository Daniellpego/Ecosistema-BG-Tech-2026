/**
 * @gradios/assets — package de assets binários compartilhados.
 *
 * Não há entry point JS real: assets são consumidos via copy-on-build pelo
 * script `sync.mjs`. Este arquivo existe apenas para satisfazer `main` do
 * package.json e expor metadata do recipe se um consumidor precisar.
 */
export const APPS = ['cfo', 'cto', 'crm', 'site'];
export const SHARED_LOGOS = ['logo.png', 'logo.webp'];

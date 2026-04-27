import preset from '@gradios/design-tokens/preset';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [preset],
  content: [
    './.storybook/**/*.{ts,tsx,mdx}',
    './src/**/*.{ts,tsx,mdx}',
    // Componentes consumidos: Tailwind precisa escanear suas classes para gerá-las.
    // Sem isto, classes declaradas dentro dos componentes (ex: text-display-2 no
    // CVA do Heading, h-11 no Button) não chegam ao CSS final.
    '../../packages/ui/src/v2/**/*.{ts,tsx}',
  ],
};

export default config;

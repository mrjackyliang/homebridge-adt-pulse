import react from '@vitejs/plugin-react';

/**
 * Vite config.
 *
 * @type {import('vite').UserConfig}
 *
 * @since 1.0.0
 */
const viteConfig = {
  base: './',
  build: {
    emptyOutDir: true,
    outDir: './build',
  },
  plugins: [
    react(),
  ],
  root: './',
};

export default viteConfig;

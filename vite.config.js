import { defineConfig } from 'vite';
const version = process.env.APP_VERSION || '1.0';
const sha = process.env.APP_SHA || 'development';
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_SHA__: JSON.stringify(sha),
    __REPOSITORY__: JSON.stringify(process.env.GITHUB_REPOSITORY || 'jakariatanjim-svg/test'),
  },
  plugins: [{
    name: 'deployment-metadata',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version, sha }) });
    },
  }],
});

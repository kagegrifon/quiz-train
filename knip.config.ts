import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['e2e/**/*.ts', 'project.config.ts'],
  project: ['src/**/*.{ts,tsx}'],
};

export default config;

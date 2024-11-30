import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Quét tất cả các file trong thư mục src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

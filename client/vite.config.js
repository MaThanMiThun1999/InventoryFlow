import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Log the current mode (development or production)
  console.log(`Current mode: ${mode}`);
  // Get Current URL
  console.log(`Current URL: ${process.env.PUBLIC_API_URL}`);

  return {
    server: {
      port: process.env.PORT || 5173,
      historyApiFallback: true,
    },
    plugins: [
      react(),
    ],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env': {
        ...process.env,
      },
    },
  };
});


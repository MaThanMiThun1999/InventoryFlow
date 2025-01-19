import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// Load environment variables from .env file
config();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Log the current mode (development or production)
  console.log(`Current mode: ${mode}`);

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


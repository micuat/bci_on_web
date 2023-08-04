import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  root: 'app',
  build: {
    outDir: "../../public",
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  server: {
    host:"0.0.0.0",
    port:3333,
    strictPort: true,
    hmr: {
      // clientPort: 443 // Run the websocket server on the SSL port
    }
  }
});

import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

<<<<<<< HEAD
// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

=======
>>>>>>> 64d1482 (initial setup)
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [solid()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
<<<<<<< HEAD
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
=======
>>>>>>> 64d1482 (initial setup)
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));

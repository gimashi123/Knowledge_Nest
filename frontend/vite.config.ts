import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
      port: 5173, // locked to a fixed port
      open: true, //  launches in browser automatically
      },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
})

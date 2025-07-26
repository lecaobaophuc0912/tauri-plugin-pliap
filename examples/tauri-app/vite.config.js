import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const host = env.VITE_TAURI_DEV_HOST;
  console.log('Development host:', host);
  return {
    plugins: [react()],
    server: {
      port: 1420,
      strictPort: true,
      host: '0.0.0.0', // Thay đổi từ true thành '0.0.0.0' để cho phép kết nối từ mobile
      hmr: host
        ? {
          protocol: "ws",
          host,
          port: 1421,
        }
        : undefined,
    },
    // Thêm cấu hình cho mobile development
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    },

    envPrefix: 'VITE_',
  }
});

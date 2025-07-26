// Environment variables utility
export const env = {
    // App Configuration
    TAURI_DEV_HOST: import.meta.env.VITE_TAURI_DEV_HOST || 'localhost',
};

// Helper function to validate required environment variables
export function validateEnv() {
    const required = ['VITE_APP_TITLE', 'VITE_API_URL'];
    const missing = required.filter(key => !import.meta.env[key]);

    if (missing.length > 0) {
        console.warn('Missing required environment variables:', missing);
    }
}

// Export for use in components
export default env; 
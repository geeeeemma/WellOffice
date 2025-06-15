import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carica le variabili d'ambiente per la modalità corrente
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@/src': path.resolve(__dirname, './src'),
    },
  },
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
      open: mode === 'development',
    // https: {}, // Disabilitato temporaneamente per risolvere ERR_SSL_VERSION_OR_CIPHER_MISMATCH
    
    // Opzione 1: Configurazione HTTPS semplice (prova questa se hai bisogno di HTTPS)
    // https: true,
    
    // Opzione 2: Configurazione HTTPS con certificati auto-generati più compatibili
    // https: {
    //   // Usa certificati auto-generati con configurazione più compatibile
    //   key: undefined, // Lascia Vite generare la chiave
    //   cert: undefined, // Lascia Vite generare il certificato
    //   minVersion: 'TLSv1.2', // Specifica versione TLS minima
    //   maxVersion: 'TLSv1.3', // Specifica versione TLS massima
    //   ciphers: [
    //     'TLS_AES_128_GCM_SHA256',
    //     'TLS_AES_256_GCM_SHA384',
    //     'TLS_CHACHA20_POLY1305_SHA256',
    //     'ECDHE-RSA-AES128-GCM-SHA256',
    //     'ECDHE-RSA-AES256-GCM-SHA384'
    //   ].join(':'),
    // },
  },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production',
    },
    define: {
      // Espone le variabili d'ambiente al client
      __DEV__: mode === 'development',
      __PROD__: mode === 'production',
    },
  }
})
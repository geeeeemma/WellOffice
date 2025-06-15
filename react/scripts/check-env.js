#!/usr/bin/env node

/**
 * Script per verificare le variabili d'ambiente
 * Uso: node scripts/check-env.js [mode]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mode = process.argv[2] || 'development';
const envFile = mode === 'production' ? '.env.production' : '.env';
const envPath = path.join(__dirname, '..', envFile);

console.log(`🔍 Checking environment configuration for mode: ${mode}`);
console.log(`📁 Looking for file: ${envFile}`);

if (!fs.existsSync(envPath)) {
  console.error(`❌ File ${envFile} not found!`);
  console.log(`💡 Create the file with these variables:`);
  console.log(`VITE_API_URL=your-api-url`);
  console.log(`VITE_OPENAI_API_KEY=your-openai-key`);
  console.log(`VITE_PORT=3000`);
  console.log(`VITE_ENV=${mode}`);
  console.log(`VITE_DEBUG=${mode === 'development'}`);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

console.log(`✅ Found ${envFile}`);
console.log(`📊 Environment variables:`);

const requiredVars = [
  'VITE_API_URL',
  'VITE_OPENAI_API_KEY', 
  'VITE_PORT',
  'VITE_ENV',
  'VITE_DEBUG'
];

let allGood = true;

requiredVars.forEach(varName => {
  if (envVars[varName]) {
    const value = varName.includes('KEY') 
      ? envVars[varName].substring(0, 10) + '...' 
      : envVars[varName];
    console.log(`  ✅ ${varName}=${value}`);
  } else {
    console.log(`  ❌ ${varName} is missing!`);
    allGood = false;
  }
});

if (allGood) {
  console.log(`🎉 All environment variables are configured!`);
} else {
  console.log(`⚠️  Some environment variables are missing.`);
  process.exit(1);
} 
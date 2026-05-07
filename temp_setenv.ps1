const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync('C:\\Users\\Administrator\\Projects\\foodie-mark\\alipay_temp_priv.txt', 'utf8');

try {
  // Delete first
  execSync('npx --yes vercel --token vcp_6FUvicyz0ensIhVtppYIWeAZODNF4g3IuiSz0LSKhGOmZqHEYr2xvYOi env rm ALIPAY_PRIVATE_KEY production --yes', { stdio: 'pipe' });
} catch(e) { /* may not exist */ }

// Use echo + pipe trick
const result = execSync('echo.' + privateKey.replace(/\n/g, '\\n') + ' | npx --yes vercel --token vcp_6FUvicyz0ensIhVtppYIWeAZODNF4g3IuiSz0LSKhGOmZqHEYr2xvYOi env add ALIPAY_PRIVATE_KEY production --yes', { 
  stdio: 'pipe',
  shell: 'powershell',
  encoding: 'utf8'
});
console.log('Result:', result.substring(0, 200));

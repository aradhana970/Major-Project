const os = require('os');
const { spawn } = require('child_process');
const qrcode = require('qrcode-terminal');

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && !alias.internal && alias.address !== '127.0.0.1') {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIpAddress();
const port = process.env.PORT || 3000;
const mobileUrl = `http://${localIp}:${port}`;

console.clear();
console.log('\n===============================================================');
console.log('📱  CAMPUSTKART MOBILE & EXPO GO SCANNER LAUNCHER');
console.log('===============================================================\n');
console.log(`🌐 Local Server IP:  http://${localIp}:${port}`);
console.log(`📱 QR Scanner Page:  http://${localIp}:${port}/qr\n`);
console.log('📲 SCAN THIS QR CODE WITH YOUR PHONE CAMERA OR EXPO GO:\n');

// Render ASCII QR Code in terminal
qrcode.generate(mobileUrl, { small: true });

console.log('\n===============================================================');
console.log('Starting Next.js Server accessible on Local Network (0.0.0.0)...');
console.log('===============================================================\n');

// Spawn Next.js dev server listening on 0.0.0.0
const nextDev = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', String(port)], {
  stdio: 'inherit',
  shell: true
});

nextDev.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
});

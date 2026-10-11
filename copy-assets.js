const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'www');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const filesToCopy = [
  'index.html',
  'diseño.css',
  'app.js',
  'DescansaTEI-Logo-.png',
  'DescansaTEI-Logo.jpg'
];

for (const file of filesToCopy) {
  const src = path.join(__dirname, file);
  const dest = path.join(targetDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copiado: ${file} -> www/${file}`);
  }
}
console.log('Sincronización de www completada.');

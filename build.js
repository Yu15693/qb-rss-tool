const fs = require('fs');
const path = require('path');

// 1. delete useless configuration files
const fileList = fs.readdirSync('./dist');
fileList
  .filter(v => v.endsWith('.json') || v.startsWith('report-'))
  .forEach(file => {
    const fullPath = path.join('./dist', file);
    fs.unlinkSync(fullPath);
  });
// 2. move index.html file
fs.renameSync('./dist/html/main/index.html', './dist/index.html');
fs.rmSync('./dist/html', { recursive: true });

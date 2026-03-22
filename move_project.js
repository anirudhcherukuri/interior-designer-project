const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\vamsh\\Interior_designer_project';
const nestName = 'Interior_designer_project';
const nestDir = path.join(rootDir, nestName);

if (!fs.existsSync(nestDir)) {
  fs.mkdirSync(nestDir);
}

const items = fs.readdirSync(rootDir);

for (const item of items) {
  if (item === nestName || item === '.git' || item === 'move_project.js') continue;
  const oldPath = path.join(rootDir, item);
  const newPath = path.join(nestDir, item);
  try {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${item} to ${newPath}`);
  } catch (err) {
    console.error(`Error moving ${item}: ${err.message}`);
  }
}

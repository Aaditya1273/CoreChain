const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs', 'templates');
const readmePath = path.join(__dirname, '..', 'README.md');

const templateFiles = [
  'project-description.md',
  'prerequisites.md',
  'local-setup.md',
  'deployment.md',
  'migration-guide.md',
  'ai-module-setup.md'
];

let finalReadmeContent = '';

templateFiles.forEach(file => {
  const filePath = path.join(docsDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    finalReadmeContent += content + '\n';
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
  }
});

try {
  fs.writeFileSync(readmePath, finalReadmeContent);
  console.log('✅ README.md generated successfully!');
} catch (error) {
  console.error('Error writing README.md:', error);
}

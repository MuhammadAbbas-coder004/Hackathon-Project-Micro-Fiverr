const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (fullPath.match(/\.(js|jsx|ts|tsx)$/)) {
      files.push(fullPath);
    }
  });
  return files;
}

const srcDir = path.resolve('src');
const allSourceFiles = getFiles(srcDir);

let hasErrors = false;

allSourceFiles.forEach(file => {
  const code = fs.readFileSync(file, 'utf-8');
  // Match import statements: import ... from "..." or '...'
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    let importPathOrig = match[1];
    
    if (importPathOrig.startsWith('@/')) {
       // @ maps to src
       let cleanPath = importPathOrig.substring(2);
       importPathOrig = path.join(srcDir, cleanPath);
       
       const exts = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx'];
       let found = false;
       for (const ext of exts) {
          const potentialPath = importPathOrig + ext;
          if (fs.existsSync(potentialPath)) {
              const parentDir = path.dirname(potentialPath);
              const baseName = path.basename(potentialPath);
              if (fs.existsSync(parentDir)) {
                 const actualFiles = fs.readdirSync(parentDir);
                 if (actualFiles.includes(baseName)) {
                   found = true;
                   break;
                 } else {
                   const caseInsensitiveMatch = actualFiles.find(f => f.toLowerCase() === baseName.toLowerCase());
                   if (caseInsensitiveMatch) {
                      console.error('Case mismatch in ' + file + ': import from \"' + match[1] + '\" resolves to ' + caseInsensitiveMatch + ' instead of expected ' + baseName);
                      hasErrors = true;
                      found = true; 
                      break;
                   }
                 }
              }
          }
       }
       if (!found) {
           const hardPath = importPathOrig;
           if (fs.existsSync(hardPath)) {
               const parentDir = path.dirname(hardPath);
               const baseName = path.basename(hardPath);
               const actualFiles = fs.readdirSync(parentDir);
               if (!actualFiles.includes(baseName)) {
                   const caseInsensitiveMatch = actualFiles.find(f => f.toLowerCase() === baseName.toLowerCase());
                   if (caseInsensitiveMatch) {
                      console.error('Case mismatch in ' + file + ': import from \"' + match[1] + '\" resolves to ' + caseInsensitiveMatch + ' instead of expected ' + baseName);
                      hasErrors = true;
                   } else {
                      console.error('File not found at all: ' + match[1] + ' in ' + file);
                      hasErrors = true;
                   }
               }
           } else {
               console.error('File not found at all : ' + match[1] + ' in ' + file);
               hasErrors = true;
           }
       }
    }
  }
});

if (!hasErrors) {
  console.log('No @ alias import errors found.');
}

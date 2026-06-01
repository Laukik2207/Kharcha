import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('client/src', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let orig = content;
    
    // Remove "import React from 'react';" completely
    content = content.replace(/import React from 'react';\r?\n?/g, '');
    
    // Replace "import React, { ... } from 'react';" with "import { ... } from 'react';"
    content = content.replace(/import React,\s*\{/g, 'import {');
    
    if (content !== orig) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed React imports in ' + filePath);
    }
  }
});

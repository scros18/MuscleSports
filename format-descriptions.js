const fs = require('fs');

const filePath = 'data/products.ts';

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Escape quotes in descriptions
content = content.replace(/"description": "([^"]*)"/g, (match, desc) => `"description": "${desc.replace(/"/g, '\\"')}"`);

// Format descriptions by replacing in the content
content = content.replace(/Features:/g, ' Features:');
content = content.replace(/Specification:/g, ' Specification:');
content = content.replace(/Package Includes:/g, ' Package Includes:');
content = content.replace(/Custom Label:/g, ' Custom Label:');
// Add spaces after colons
content = content.replace(/:([A-Z])/g, ': $1');
// Add spaces before sub-items
content = content.replace(/([A-Z][a-z]+): /g, ' $1: ');
// Clean up multiple spaces
content = content.replace(/  +/g, ' ');

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log('Formatted descriptions in the file');

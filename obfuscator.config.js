// JavaScript Obfuscator Configuration
// This configuration provides strong protection while maintaining functionality

module.exports = {
  // Compact code output (remove whitespace)
  compact: true,
  
  // Control flow flattening makes code harder to understand
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  
  // Dead code injection adds fake code paths
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  
  // Debug protection prevents debugging
  debugProtection: false, // Set to true for stronger protection (may affect dev tools)
  debugProtectionInterval: 0,
  
  // Disable console output in production
  disableConsoleOutput: true,
  
  // Domain lock (optional - uncomment and set your domains)
  // domainLock: ['yourdomain.com', 'www.yourdomain.com'],
  
  // Identifiers generator
  identifierNamesGenerator: 'hexadecimal',
  identifiersPrefix: '',
  
  // Source map (disable for production)
  sourceMap: false,
  sourceMapMode: 'separate',
  
  // String array encoding
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  
  // Additional transformations
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
  
  // Self defending code
  selfDefending: true,
  
  // Numbers to expressions
  numbersToExpressions: true,
  
  // Simplify code
  simplify: true,
  
  // Split strings
  splitStrings: true,
  splitStringsChunkLength: 10,
  
  // Target environment
  target: 'browser',
  
  // Rename globals
  renameGlobals: false, // Can break Next.js if true
  
  // Ignore specific files (Next.js internals)
  ignoreRequireImports: true,
  
  // Log output
  log: false,
};

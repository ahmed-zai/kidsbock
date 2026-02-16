// client/src/setupTests.js
import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder if not present in JSDOM environment
// React Router DOM v6+ might rely on this
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}


// Jest setup file
require('dotenv').config({ path: '.env.test' });

// Suppress console output in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

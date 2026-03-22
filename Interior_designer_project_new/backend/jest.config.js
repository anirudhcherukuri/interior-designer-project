/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  // Run each test file in a separate worker process to prevent
  // mongoose connection conflicts between test suites
  maxWorkers: 1,
  forceExit: true,
  testTimeout: 30000,
  // Clear mocks between tests
  clearMocks: true,
  resetModules: true,
  verbose: true,
};

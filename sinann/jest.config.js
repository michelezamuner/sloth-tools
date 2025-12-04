/** @type {import('jest').Config} */
const config = {
  roots: ['./src/', './tests'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  verbose: true,
  collectCoverageFrom: ['**/*.js'],
  coverageDirectory: '/tmp',
  coveragePathIgnorePatterns: [],
  coverageReporters: ['text'],
  transform: {},
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

export default config;

// Use this import which should be available without additional packages
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  setupFilesAfterEnv: [
    '<rootDir>/src/tests/setupJest.ts'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.spec.json',
      useESM: true,
      isolatedModules: true
    }]
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testMatch: ['**/tests/apiEndpoints.test.ts?(x)'],
  testTimeout: 60000,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  verbose: true,
  maxWorkers: 1,
  detectOpenHandles: true
};

export default config;
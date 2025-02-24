import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  rootDir: '.',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        useESM: true
      }
    ]
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testMatch: ['**/tests/(auth|apiEndpoints).test.ts?(x)'],
  testPathIgnorePatterns: ['<rootDir>/src/pages/'],
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 30000,
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/tests/**/*.{ts,tsx}',
    '!src/pages/**/*.{ts,tsx}',
    '!src/components/**/*.{ts,tsx}'
  ],
  coverageReporters: ['html', 'text-summary', 'lcov']
};

export default config;
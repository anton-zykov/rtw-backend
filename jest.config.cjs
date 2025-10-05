module.exports = {
  clearMocks: true,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/prismaMock.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  moduleNameMapper: {
    // map "#/foo/bar(.js)?" → "<rootDir>/src/foo/bar"
    '^#/(.*)\\.js$': '<rootDir>/src/$1',
    '^#/(.*)$': '<rootDir>/src/$1',

    // keep the ESM .js import shim for relative paths
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

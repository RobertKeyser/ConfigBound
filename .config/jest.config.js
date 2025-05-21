/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-useless-escape */

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export const testEnvironment = 'node';
export const transform = {
  '^.+\.tsx?$': ['ts-jest', {}]
};
export const extensionsToTreatAsEsm = ['.ts'];
export const testMatch = [
  '**/__tests__/**/*.[jt]s?(x)',
  '**/?(*.)+(spec|test).[tj]s?(x)'
];
export const testPathIgnorePatterns = ['dist/'];
export const runner = 'groups';
export const rootDir = '../';

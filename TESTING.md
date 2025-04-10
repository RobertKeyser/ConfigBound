# Testing ConfigBound

## Basic usage

There are three variants of the npm test script:

- `test` - Runs tests
- `test:dev` - Runs the tests and watches for file changes
- `test:coverage` - Runs the tests and generates a coverage report

## Advanced usage

Targeting a specific group of tests:

```
npm run test -- --group=unit
npm run test -- --group=integration
```

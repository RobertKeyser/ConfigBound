import { ConfigElement } from './configElement';
import { ConfigUnsetException } from './errors';

describe('ConfigElement', () => {
  let configElement: ConfigElement<string>;

  beforeEach(() => {
    configElement = new ConfigElement<string>(
      'testName',
      'A test config element',
      'defaultValue',
      'exampleValue',
      false
    );
  });

  test('should initialize with correct values', () => {
    expect(configElement.name).toBe('testName');
    expect(configElement.description).toBe('A test config element');
    expect(configElement.default).toBe('defaultValue');
    expect(configElement.example).toBe('exampleValue');
    expect(configElement.sensitive).toBe(false);
    expect(configElement.value).toBeUndefined();
  });

  test('set method should set the value', () => {
    configElement.set('newValue');
    expect(configElement.value).toBe('newValue');
  });

  test('set method should set value to default if no value is provided', () => {
    configElement.set();
    expect(configElement.value).toBe('defaultValue');
  });

  test('get method should return the current value', () => {
    configElement.set('newValue');
    expect(configElement.get()).toBe('newValue');
  });

  test('get method should return undefined if value is not set', () => {
    expect(configElement.get()).toBeUndefined();
  });

  test('getOrThrow method should return the value if set', () => {
    configElement.set('newValue');
    expect(configElement.getOrThrow()).toBe('newValue');
  });

  test('getOrThrow method should throw ConfigUnsetException if value is not set', () => {
    expect(() => configElement.getOrThrow()).toThrow(ConfigUnsetException);
  });
});

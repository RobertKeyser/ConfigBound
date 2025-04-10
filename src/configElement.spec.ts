import Joi from 'joi';
import { ConfigElement } from './configElement';
import { ConfigInvalidException, ConfigUnsetException } from './errors';
import { ConfigBound } from './configBound';
import { ConfigSection } from './configSection';
import { EnvVarBind } from './configBinds/envVar';

/**
 * @group unit
 */
describe('ConfigElement', () => {
  let configBound: ConfigBound;
  let configElement: ConfigElement<string>;
  let configElementNoDefault: ConfigElement<string>;

  beforeEach(() => {
    // Element with default value
    configElement = new ConfigElement<string>(
      'testName',
      'A test config element',
      'defaultValue',
      'exampleValue',
      false
    );

    // Element without default value
    configElementNoDefault = new ConfigElement<string>(
      'testNoDefault',
      'A test config element without default',
      undefined,
      'exampleValue',
      false
    );

    // Create section with both elements
    const configSection = new ConfigSection('TestSection', [
      configElement,
      configElementNoDefault
    ]);

    // Create bind and config bound
    const envVarBind = new EnvVarBind();
    configBound = new ConfigBound('TestConfig', [envVarBind], []);
    configBound.addConfigSection(configSection);
  });

  test('should initialize with correct values', () => {
    expect(configElement.name).toBe('testName');
    expect(configElement.description).toBe('A test config element');
    expect(configElement.default).toBe('defaultValue');
    expect(configElement.example).toBe('exampleValue');
    expect(configElement.sensitive).toBe(false);
    expect(configElement.value).toBeUndefined();
  });

  // Test for constructor with invalid default value
  test('constructor should throw ConfigInvalidException when default value is invalid', () => {
    expect(() => {
      new ConfigElement<number>(
        'invalidDefault',
        'Config with invalid default',
        -10, // Invalid default according to validator
        100,
        false,
        Joi.number().min(0).max(100) // Validator requires positive numbers
      );
    }).toThrow(ConfigInvalidException);
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
    expect(configElement.get(configBound)).toBe('newValue');
  });

  test('get method should return default if value is not set and default exists', () => {
    // Element with default should return default
    expect(configElement.get(configBound)).toBe('defaultValue');
  });

  test('get method should return undefined if value is not set and no default exists', () => {
    // Element without default should return undefined
    expect(configElementNoDefault.get(configBound)).toBeUndefined();
  });

  test('getOrThrow method should return the value if set', () => {
    configElement.set('newValue');
    expect(configElement.getOrThrow(configBound)).toBe('newValue');
  });

  test('getOrThrow method should return default if value is not set but default exists', () => {
    expect(configElement.getOrThrow(configBound)).toBe('defaultValue');
  });

  test('getOrThrow method should throw ConfigUnsetException if value is not set and no default exists', () => {
    expect(() => configElementNoDefault.getOrThrow(configBound)).toThrow(
      ConfigUnsetException
    );
  });

  // Test for isRequired functionality
  test('isRequired should return true when validator has required presence', () => {
    const configElement = new ConfigElement<string>(
      'requiredConfig',
      'A required config element',
      'default',
      'example',
      false,
      Joi.string().required()
    );

    expect(configElement.isRequired()).toBe(true);
  });

  test('isRequired should return false when validator does not have required presence', () => {
    const configElement = new ConfigElement<string>(
      'optionalConfig',
      'An optional config element',
      'default',
      'example'
    );

    expect(configElement.isRequired()).toBe(false);
  });
});

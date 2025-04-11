import Joi from 'joi';
import { ConfigBound } from './configBound';
import { ConfigElement } from './configElement';
import { ConfigSection } from './configSection';
import { EnvVarBind } from './configBinds/envVar';

/**
 * @group integration
 */
describe('BindContext functionality', () => {
  let configBound: ConfigBound;
  let serverSection: ConfigSection;
  let databaseSection: ConfigSection;
  let portElement: ConfigElement<number>;
  let hostElement: ConfigElement<string>;
  let dbHostElement: ConfigElement<string>;
  let dbPortElement: ConfigElement<number>;

  beforeEach(() => {
    // Set environment variables before creating any objects
    process.env.TEST_APP_SERVER_PORT = '8081';
    process.env.TEST_APP_DATABASE_HOST = 'test-db.example.com';

    // Create config elements for server
    portElement = new ConfigElement<number>(
      'port',
      'The port for the server to listen on',
      3000, // default
      8080, // example
      false, // not sensitive
      Joi.number().port().required()
    );

    hostElement = new ConfigElement<string>(
      'host',
      'The host for the server',
      'localhost', // default
      '0.0.0.0', // example
      false, // not sensitive
      Joi.string().required()
    );

    // Create config elements for database
    dbHostElement = new ConfigElement<string>(
      'host',
      'The database host',
      'localhost', // default
      'db.example.com', // example
      false, // not sensitive
      Joi.string().required()
    );

    dbPortElement = new ConfigElement<number>(
      'port',
      'The database port',
      5432, // default
      5432, // example
      false, // not sensitive
      Joi.number().port().required()
    );

    // Create sections
    serverSection = new ConfigSection(
      'server',
      [portElement, hostElement],
      'Server configuration settings'
    );

    databaseSection = new ConfigSection(
      'database',
      [dbHostElement, dbPortElement],
      'Database configuration settings'
    );

    // Create bind first
    const envVarBind = new EnvVarBind('TEST_APP');

    // Create the config bound with bind and then add sections
    configBound = new ConfigBound('my-app', [envVarBind], []);

    // Add sections to the configBound
    configBound.addConfigSection(serverSection);
    configBound.addConfigSection(databaseSection);
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.TEST_APP_SERVER_PORT;
    delete process.env.TEST_APP_DATABASE_HOST;
  });

  test('elements can get their values directly from the bind context', () => {
    // Get the bind context from the section
    const serverBindContext = serverSection.getBindContext();
    expect(serverBindContext).toBeDefined();

    // Elements should be able to get their values from the bind context
    const portValue = portElement.get<number>(serverBindContext!);
    expect(portValue).toBe(8081);

    // Host element should use default since not in env
    const hostValue = hostElement.get<string>(serverBindContext!);
    expect(hostValue).toBe('localhost');
  });

  test('sections can get element values directly with getValue', () => {
    // Get element values through the section
    const portValue = serverSection.getValue<number>('port');
    expect(portValue).toBe(8081);

    const dbHostValue = databaseSection.getValue<string>('host');
    expect(dbHostValue).toBe('test-db.example.com');

    // Non-existent element should return undefined
    const nonExistentValue = serverSection.getValue<string>('nonexistent');
    expect(nonExistentValue).toBeUndefined();
  });

  test('configBound can get values via get method', () => {
    // Get values through the configBound
    const portValue = configBound.get<number>('server', 'port');
    expect(portValue).toBe(8081);

    const dbHostValue = configBound.get<string>('database', 'host');
    expect(dbHostValue).toBe('test-db.example.com');

    // Element with default value should use default
    const hostValue = configBound.get<string>('server', 'host');
    expect(hostValue).toBe('localhost');
  });
});

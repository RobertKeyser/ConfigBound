import Joi from 'joi';
import { ConfigBound } from '../configBound';
import { ConfigElement } from '../configElement';
import { ConfigSection } from '../configSection';
import { EnvVarBind } from '../configBinds/envVar';

let config: ConfigBound;

/**
 * @group integration
 */
describe('configBindExample', () => {
  beforeEach(() => {
    // Set environment variables first
    process.env.MY_APP_SERVER_PORT = '8081';
    process.env.MY_APP_API_APIKEY = 'abc123';

    // Create config elements
    const serverPortElement = new ConfigElement<number>(
      'port',
      'The port for the server to listen on',
      3000, // default
      8080, // example
      false, // not sensitive
      Joi.number().port().required()
    );

    const apiKeyElement = new ConfigElement<string>(
      'apiKey',
      'API key for external service',
      undefined, // no default
      'abc123', // example
      true, // sensitive
      Joi.string().required()
    );

    // Create a section
    const serverSection = new ConfigSection(
      'server',
      [serverPortElement],
      'Server configuration settings'
    );

    const apiSection = new ConfigSection(
      'api',
      [apiKeyElement],
      'API configuration settings'
    );

    // Create an env var bind
    const envVarBind = new EnvVarBind('MY_APP');

    // Create the config bound with the bind
    config = new ConfigBound('my-app', [envVarBind], []);

    // Add sections after creating the config bound
    config.addConfigSection(serverSection);
    config.addConfigSection(apiSection);
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.MY_APP_SERVER_PORT;
    delete process.env.MY_APP_API_APIKEY;
  });

  it('should bind the config elements', () => {
    expect(config).toBeDefined();
  });

  it('should get the port from the env var', () => {
    expect(config.get<number>('server', 'port')).toBe(8081);
  });

  it('should get the api key from the env var', () => {
    expect(config.get<string>('api', 'apiKey')).toBe('abc123');
  });
});

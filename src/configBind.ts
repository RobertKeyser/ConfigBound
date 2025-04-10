// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ConfigElement } from './configElement';

/**
 * A ConfigBind is the retrieves the values of the {@link ConfigElement ConfigElements} from their source.
 */
export abstract class ConfigBind {
  readonly name: ConfigBindName;

  constructor(name: ConfigBindName) {
    this.name = name;
  }

  /**
   * Retrieves the value of the ConfigBind.
   */
  abstract retrieve<T>(elementName: string): T | undefined;

  /**
   * Gets the value from the bind for a specific element
   */
  get<T>(sectionName: string, elementName: string): T | undefined {
    return this.retrieve<T>(`${sectionName}.${elementName}`);
  }
}

/**
 * Kinds of ConfigBinds.
 */
export type ConfigBindName = 'EnvironmentVariable';

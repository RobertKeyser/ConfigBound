// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Element } from '../element/element';

/**
 * A Bind is the retrieves the values of the {@link Element   } from their source.
 */
export abstract class Bind {
  readonly name: BindName;

  constructor(name: BindName) {
    this.name = name;
  }

  /**
   * Retrieves the value of the Bind.
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
 * Kinds of Binds.
 */
export type BindName = 'EnvironmentVariable';

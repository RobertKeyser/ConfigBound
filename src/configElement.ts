import { ConfigUnsetException } from './errors';
import { sanitizeName } from './utilities/sanitizeNames';

/**
 * A ConfigElement is a single configuration option
 */
export class ConfigElement<T> {
  /**
   * The name of the ConfigElement
   */
  readonly name: string;
  /**
   * Whether the ConfigElement is sensitive
   */
  sensitive: boolean;
  /**
   * An optional description of the ConfigElement
   */
  description?: string;
  /**
   * The default value of the ConfigElement
   */
  default?: T;
  /**
   * An example value of the ConfigElement
   */
  example?: T;
  /**
   * The value of the ConfigElement
   */
  value?: T;

  constructor(
    name: string,
    description?: string,
    defaultValue?: T,
    exampleValue?: T,
    sensitive: boolean = false
  ) {
    this.name = sanitizeName(name);
    this.description = description;
    this.default = defaultValue;
    this.example = exampleValue;
    this.sensitive = sensitive;
  }

  /**
   * Set the value of ConfigElement
   * @param value - The value of the element
   */
  set(value?: T): void {
    this.value = value ?? this.default;
  }

  /**
   * Retrieves the value of the element
   * @returns the value of the ConfigElement. If it's unset, then it returns undefined.
   */
  get(): T | undefined {
    return this.value;
  }

  /**
   * Retrieves the value of the element or throws an error if the value isn't found.
   * @throws {@link ConfigUnsetException ConfigUnsetException} if the value has not been set
   * @returns the value of the ConfigElement.
   */
  getOrThrow(): T {
    if (typeof this.value === 'undefined') {
      throw new ConfigUnsetException(this.name);
    }
    return this.value;
  }
}

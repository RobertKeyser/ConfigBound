import Joi from 'joi';
import { ConfigInvalidException, ConfigUnsetException } from './errors';
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
   * The Joi validator of the ConfigElement
   */
  validator: Joi.AnySchema<T>;
  /**
   * The value of the ConfigElement
   */
  value?: T;

  constructor(
    name: string,
    description?: string,
    defaultValue?: T,
    exampleValue?: T,
    sensitive: boolean = false,
    validator: Joi.AnySchema<T> = Joi.any<T>()
  ) {
    this.name = sanitizeName(name);
    this.description = description;
    this.validator = validator;

    // Ensure the default value is valid
    if (defaultValue) {
      const defaultValueResult = this.validator.validate(defaultValue);
      if (defaultValueResult.error) {
        throw new ConfigInvalidException(
          this.name,
          defaultValueResult.error.message
        );
      }
    }
    this.sensitive = sensitive;
    this.default = defaultValue;

    // Example values are not validated because they might use placeholder values that wouldn't validate
    this.example = exampleValue;
  }

  /**
   * Returns true if the ConfigElement is required
   */
  isRequired(): boolean {
    return this.validator._flags.presence === 'required';
  }

  /**
   * Set the value of ConfigElement
   * @param value - The value of the element
   */
  set(value?: T): void {
    const result = this.validator.validate(value);
    if (result.error) {
      throw new ConfigInvalidException(this.name, result.error.message);
    }
    this.value = result.value ?? this.default;
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

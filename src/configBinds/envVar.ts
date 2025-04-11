import { ConfigBind } from '../configBind';

/**
 * A ConfigBind that retrieves the value of an environment variable.
 */
export class EnvVarBind extends ConfigBind {
  envVarPrefix?: string;

  constructor(envVarPrefix?: string) {
    super('EnvironmentVariable');
    this.envVarPrefix = envVarPrefix;
  }

  /**
   * Retrieves the value of the environment variable
   * @param fullName The full name of the element in format sectionName.elementName
   * @returns The value of the environment variable.
   */
  retrieve<T>(fullName: string): T | undefined {
    const envVarName = this.getEnvVarName(fullName);
    const envVarValue = process.env[envVarName];

    if (envVarValue === undefined) {
      return undefined;
    }

    // Try to convert the string value to the appropriate type
    return this.convertValue<T>(envVarValue);
  }

  /**
   * Convert a string value to the appropriate type
   * @param value - The string value to convert
   * @returns The converted value
   */
  private convertValue<T>(value: string): T {
    // Try to parse as number if it looks like a number
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      // If it's an integer
      if (/^-?\d+$/.test(value)) {
        return Number.parseInt(value, 10) as unknown as T;
      }
      // If it's a float
      return Number.parseFloat(value) as unknown as T;
    }

    // Try to parse as boolean
    if (value.toLowerCase() === 'true') {
      return true as unknown as T;
    }
    if (value.toLowerCase() === 'false') {
      return false as unknown as T;
    }

    // Return as string by default
    return value as unknown as T;
  }

  /**
   * Gets the name of the environment variable.
   * @param envVarName The name of the environment variable.
   * @returns The name of the environment variable.
   */
  getEnvVarName(envVarName: string): string {
    let name = envVarName.replace(/\./g, '_'); // Replace dots with underscores
    if (this.envVarPrefix) {
      name = `${this.envVarPrefix}_${name}`;
    }
    return name.toUpperCase();
  }
}

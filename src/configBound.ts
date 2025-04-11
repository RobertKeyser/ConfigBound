import { BindContext } from './bindContext';
import { ConfigBind } from './configBind';
import { ConfigSection } from './configSection';
import {
  ElementNotFoundException,
  SectionExistsException,
  SectionNotFoundException
} from './errors';
import { ConsoleLogger, Logger } from './utilities/logger';
import { sanitizeName } from './utilities/sanitizeNames';

/**
 * A ConfigBound is the top level object that contains all the {@link ConfigSection ConfigSections}
 */
export class ConfigBound implements BindContext {
  readonly name: string;
  private logger: Logger;
  readonly configBinds: ConfigBind[];
  private sections: ConfigSection[];

  constructor(
    name: string,
    configBinds: ConfigBind[] = [],
    sections: ConfigSection[] = [],
    logger?: Logger
  ) {
    this.logger = logger ?? new ConsoleLogger();
    this.name = sanitizeName(name);
    this.configBinds = configBinds;
    this.sections = [];

    // Add sections after initialization so we can pass this as the bindContext
    if (sections.length > 0) {
      sections.forEach((section) => this.addConfigSection(section));
    }
  }

  /**
   * Adds a ConfigBind to the ConfigBound
   * @param configBind - The ConfigBind to add
   */
  public addConfigBind(configBind: ConfigBind) {
    this.logger.debug(`Adding config bind: ${configBind.name}`);
    this.configBinds.push(configBind);
  }

  /**
   * Adds a ConfigSection to the ConfigBound
   * @param section - The ConfigSection to add
   */
  public addConfigSection(section: ConfigSection) {
    this.logger.debug(`Adding config section: ${section.name}`);
    const sanitizedName = sanitizeName(section.name);
    if (this.sections.some((x) => x.name === sanitizedName)) {
      throw new SectionExistsException(sanitizedName);
    }
    // Pass the logger to the section
    section.setLogger(this.logger);

    // Pass this ConfigBound as the BindContext to the section
    section.setBindContext(this);

    this.sections.push(section);
  }

  /**
   * Gets the ConfigSections of the ConfigBound
   * @returns The ConfigSections
   */
  public getSections() {
    return this.sections;
  }

  /**
   * Gets the value of a ConfigElement using the first available ConfigBind
   * @param sectionName - The name of the section
   * @param elementName - The name of the element
   * @returns The value of the element
   */
  public get<T>(sectionName: string, elementName: string): T | undefined {
    this.logger.debug(`Getting value for ${sectionName}.${elementName}`);

    // Check if section exists
    const section = this.sections.find((x) => x.name === sectionName);
    if (!section) {
      throw new SectionNotFoundException(sectionName);
    }
    // Check if element exists
    const element = section.getElements().find((x) => x.name === elementName);
    if (!element) {
      throw new ElementNotFoundException(elementName);
    }
    // Try to get value from each ConfigBind until one returns a value
    for (const configBind of this.configBinds) {
      const value = configBind.get<T>(sectionName, elementName);
      if (value !== undefined) {
        this.logger.trace?.(
          `Found value for ${sectionName}.${elementName} in ${configBind.name}: ${element.sensitive ? '[MASKED]' : value}`
        );
        return value;
      } else {
        this.logger.trace?.(
          `No value found for ${sectionName}.${elementName} in ${configBind.name}`
        );
      }
    }

    // If no value found in binds but element has a default, use that
    if (element.default !== undefined) {
      this.logger.debug(
        `Using default value for ${sectionName}.${elementName}: ${element.sensitive ? '[MASKED]' : element.default}`
      );
      return element.default as unknown as T;
    }

    // If no bind returned a value, return undefined
    this.logger.debug(`No value found for ${sectionName}.${elementName}`);
    return undefined;
  }

  /**
   * Gets the value of a ConfigElement
   * @param sectionName - The name of the section
   * @param elementName - The name of the element
   * @returns The value of the element or throws if not found
   */
  public getOrThrow<T>(sectionName: string, elementName: string): T {
    const value = this.get<T>(sectionName, elementName);
    if (value === undefined) {
      throw new ElementNotFoundException(elementName);
    }
    return value;
  }
}

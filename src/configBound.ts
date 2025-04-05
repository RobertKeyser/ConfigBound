import { ConfigSection } from './configSection';
import { SectionExistsException } from './errors';
import { sanitizeName } from './utilities/sanitizeNames';

// Adding the missing envVarPrefix export variable
export let envVarPrefix: string;

/**
 * A ConfigBound is the top level object that contains all the {@link ConfigSection ConfigSections}
 */
export class ConfigBound {
  name: string;
  private sections: ConfigSection[];

  constructor(name: string, sections: ConfigSection[] = [], prefix?: string) {
    this.name = sanitizeName(name);
    this.sections = sections;

    // Set the global envVarPrefix if a prefix is provided
    if (prefix) {
      envVarPrefix = prefix;
    }
  }

  /**
   * Adds a ConfigSection to the ConfigBound
   * @param section - The ConfigSection to add
   */
  public addConfigSection(section: ConfigSection) {
    const sanitizedName = sanitizeName(section.name);
    if (this.sections.some((x) => x.name === sanitizedName)) {
      throw new SectionExistsException(sanitizedName);
    }
    this.sections.push(section);
  }

  /**
   * Gets the ConfigSections of the ConfigBound
   * @returns The ConfigSections
   */
  public getSections() {
    return this.sections;
  }
}

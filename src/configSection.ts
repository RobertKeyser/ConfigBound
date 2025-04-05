import { ConfigElement } from './configElement';
import { ElementExistsException } from './errors';
import { sanitizeName } from './utilities/sanitizeNames';

/**
 * A grouping of {@link ConfigElement ConfigElements}
 */
export class ConfigSection {
  /**
   * The name of the ConfigSection
   */
  name: string;
  /**
   * An optional description of the ConfigSection
   */
  description?: string;
  /**
   * The {@link ConfigElement ConfigElements} of the ConfigSection
   */
  private elements: ConfigElement<unknown>[];

  constructor(
    name: string,
    elements: ConfigElement<unknown>[],
    description?: string
  ) {
    this.name = sanitizeName(name);
    this.description = description;
    this.elements = elements;
  }

  /**
   * Finds duplicate {@link ConfigElement ConfigElements} in a given array.
   * @param elements - The array of ConfigElements to search
   * @returns An array of ConfigElements that have duplicate names
   */
  public static findDuplicateElements(
    elements: ConfigElement<unknown>[]
  ): ConfigElement<unknown>[] {
    // Count occurrences of each name
    const nameCounts = elements.reduce(
      (acc, element) => {
        acc[element.name] = (acc[element.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Get names that appear more than once
    const duplicateNames = Object.keys(nameCounts).filter(
      (name) => nameCounts[name] > 1
    );

    // Return all elements whose names appear in the duplicateNames list
    return elements.filter((element) => duplicateNames.includes(element.name));
  }

  /**
   * Sets the {@link ConfigElement ConfigElements} of the ConfigSection
   * @param elements - The array of ConfigElements to set
   */
  public setElements(elements: ConfigElement<unknown>[]) {
    const duplicateElements = ConfigSection.findDuplicateElements(elements);
    if (duplicateElements.length > 0) {
      throw new ElementExistsException(duplicateElements[0].name);
    }
    this.elements = elements;
  }

  /**
   * Adds a {@link ConfigElement ConfigElement} to the ConfigSection
   * @param element - The ConfigElement to add
   */
  public addElement(element: ConfigElement<unknown>) {
    // Create a new array with all current elements plus the new one
    const newElements = this.elements.concat([element]);

    // Check for duplicates
    const duplicateElements = ConfigSection.findDuplicateElements(newElements);
    if (duplicateElements.length > 0) {
      throw new ElementExistsException(duplicateElements[0].name);
    }

    // If no duplicates, update the elements array
    this.elements = newElements;
  }

  /**
   * Gets the {@link ConfigElement ConfigElements} of the ConfigSection
   * @returns The array of ConfigElements
   */
  public getElements() {
    return this.elements;
  }
}

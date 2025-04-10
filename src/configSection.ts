import { ConfigElement } from './configElement';
import { ElementExistsException } from './errors';
import { Logger } from './utilities/logger';
import { sanitizeName } from './utilities/sanitizeNames';
import { BindContext } from './bindContext';

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
  /**
   * Logger instance
   */
  private logger?: Logger;
  /**
   * Reference to the parent BindContext
   */
  private bindContext?: BindContext;

  constructor(
    name: string,
    elements: ConfigElement<unknown>[],
    description?: string,
    logger?: Logger,
    bindContext?: BindContext
  ) {
    this.name = sanitizeName(name);
    this.description = description;
    this.logger = logger;
    this.bindContext = bindContext;
    // Initialize with empty elements array, then add each element with parent section reference
    this.elements = [];
    if (elements.length > 0) {
      this.setElements(elements);
    }
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
    this.elements = [];
    elements.forEach((element) => {
      this.addElement(element);
    });
  }

  /**
   * Sets the logger instance
   * @param logger - The logger to use
   */
  public setLogger(logger: Logger): void {
    this.logger = logger;
    // Pass logger to all existing elements
    this.elements.forEach((element) => {
      element.setLogger(logger);
    });
  }

  /**
   * Sets the bind context
   * @param bindContext - The BindContext to use
   */
  public setBindContext(bindContext: BindContext): void {
    this.bindContext = bindContext;
    // No need to pass to elements as they'll use it when needed
  }

  /**
   * Gets the current bind context
   * @returns The current BindContext or undefined if not set
   */
  public getBindContext(): BindContext | undefined {
    return this.bindContext;
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

    // Set the parent section name
    element.setParentSection(this.name);

    // Pass the logger to the element if we have one
    if (this.logger) {
      element.setLogger(this.logger);
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

  /**
   * Gets a specific element by name
   * @param elementName - The name of the element to get
   * @returns The element or undefined if not found
   */
  public getElement(elementName: string): ConfigElement<unknown> | undefined {
    return this.elements.find((element) => element.name === elementName);
  }

  /**
   * Gets the value of a specific element using the current bind context
   * @param elementName - The name of the element to get the value for
   * @returns The value or undefined if not found or no bind context set
   */
  public getValue<T>(elementName: string): T | undefined {
    if (!this.bindContext) {
      this.logger?.warn(
        `Cannot get value for ${this.name}.${elementName}: No bind context set`
      );
      return undefined;
    }
    const element = this.getElement(elementName);
    if (!element) {
      this.logger?.warn(`Element not found: ${elementName}`);
      return undefined;
    }
    return element.get<T>(this.bindContext);
  }
}

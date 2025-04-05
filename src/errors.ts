import { ConfigElement } from './configElement';
import { ConfigSection } from './configSection';

/**
 * An error that occurs when a {@link ConfigElement ConfigElement} is unset
 */
export class ConfigUnsetException extends Error {
  constructor(message: string) {
    super();
    this.name = ConfigUnsetException.name;
    this.message = message;
  }
}

/**
 * An error that occurs when an item already exists
 */
export abstract class ItemExistsException extends Error {
  constructor(itemType: string, itemName: string, additionalMessage?: string) {
    super();
    this.name = ItemExistsException.name;
    this.message = `${itemType} with name ${itemName} already exists.`;
    if (additionalMessage) {
      this.message = `${this.message} ${additionalMessage}`;
    }
  }
}

/**
 * An error that occurs when a {@link ConfigSection ConfigSection} already exists
 */
export class SectionExistsException extends ItemExistsException {
  constructor(sectionName: string, additionalMessage?: string) {
    super('Section', sectionName, additionalMessage);
    this.name = SectionExistsException.name;
  }
}

/**
 * An error that occurs when a {@link ConfigElement ConfigElement} already exists
 */
export class ElementExistsException extends ItemExistsException {
  constructor(elementName: string, additionalMessage?: string) {
    super('Element', elementName, additionalMessage);
    this.name = ElementExistsException.name;
  }
}

/**
 * An error that occurs when the name of a configuration component is invalid
 */
export class InvalidNameException extends Error {
  constructor(message: string) {
    super();
    this.name = InvalidNameException.name;
    this.message = message;
  }
}

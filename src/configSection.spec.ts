import { ConfigSection } from './configSection';
import { ConfigElement } from './configElement';
import { ElementExistsException } from './errors';

describe('ConfigSection', () => {
  let section: ConfigSection;
  let element1: ConfigElement<string>;
  let element2: ConfigElement<number>;

  beforeEach(() => {
    element1 = new ConfigElement<string>(
      'element1',
      'First element',
      'default',
      'example'
    );
    element2 = new ConfigElement<number>('element2', 'Second element', 42, 100);
    section = new ConfigSection(
      'TestSection',
      [element1, element2],
      'Test section description'
    );
  });

  describe('constructor', () => {
    it('should initialize with the correct name, elements and description', () => {
      expect(section.name).toBe('TestSection');
      expect(section.description).toBe('Test section description');
      // We can't test private property directly, but we can test it indirectly
      expect((section as any).elements).toEqual([element1, element2]);
    });

    it('should initialize without a description', () => {
      const sectionWithoutDesc = new ConfigSection('NoDesc', [element1]);
      expect(sectionWithoutDesc.name).toBe('NoDesc');
      expect(sectionWithoutDesc.description).toBeUndefined();
      expect((sectionWithoutDesc as any).elements).toEqual([element1]);
    });
  });

  describe('findDuplicateElements', () => {
    it('should return an empty array when no duplicates exist', () => {
      const noDuplicates = [
        new ConfigElement<string>('unique1', 'Unique 1'),
        new ConfigElement<string>('unique2', 'Unique 2'),
        new ConfigElement<string>('unique3', 'Unique 3')
      ];

      const result = ConfigSection.findDuplicateElements(noDuplicates);
      expect(result).toEqual([]);
    });

    it('should return all elements with duplicate names', () => {
      const duplicateElement1 = new ConfigElement<string>(
        'duplicate',
        'Duplicate 1'
      );
      const duplicateElement2 = new ConfigElement<number>(
        'duplicate',
        'Duplicate 2'
      );
      const uniqueElement = new ConfigElement<boolean>('unique', 'Unique');

      const elementsWithDuplicates = [
        duplicateElement1,
        uniqueElement,
        duplicateElement2
      ];

      const result = ConfigSection.findDuplicateElements(
        elementsWithDuplicates
      );
      expect(result).toEqual([duplicateElement1, duplicateElement2]);
    });

    it('should handle multiple sets of duplicates', () => {
      const dupA1 = new ConfigElement<string>('dupA', 'Duplicate A1');
      const dupA2 = new ConfigElement<string>('dupA', 'Duplicate A2');
      const dupB1 = new ConfigElement<string>('dupB', 'Duplicate B1');
      const dupB2 = new ConfigElement<string>('dupB', 'Duplicate B2');
      const uniqueC = new ConfigElement<string>('uniqueC', 'Unique C');

      const elements = [dupA1, dupB1, uniqueC, dupA2, dupB2];

      const result = ConfigSection.findDuplicateElements(elements);
      expect(result).toContainEqual(dupA1);
      expect(result).toContainEqual(dupA2);
      expect(result).toContainEqual(dupB1);
      expect(result).toContainEqual(dupB2);
      expect(result).not.toContainEqual(uniqueC);
      expect(result.length).toBe(4);
    });

    it('should handle an empty array', () => {
      const result = ConfigSection.findDuplicateElements([]);
      expect(result).toEqual([]);
    });
  });

  describe('setElements', () => {
    it('should update elements when there are no duplicates', () => {
      const newElements = [
        new ConfigElement<string>('new1', 'New Element 1'),
        new ConfigElement<number>('new2', 'New Element 2')
      ];

      section.setElements(newElements);

      // We can verify indirectly since elements is private
      expect((section as any).elements).toEqual(newElements);
    });

    it('should throw ElementExistsException when duplicates exist', () => {
      const duplicateElement1 = new ConfigElement<string>(
        'duplicate',
        'Duplicate 1'
      );
      const duplicateElement2 = new ConfigElement<number>(
        'duplicate',
        'Duplicate 2'
      );

      expect(() => {
        section.setElements([duplicateElement1, duplicateElement2]);
      }).toThrow(ElementExistsException);

      expect(() => {
        section.setElements([duplicateElement1, duplicateElement2]);
      }).toThrow('Element with name duplicate already exists');
    });

    it('should accept an empty array', () => {
      section.setElements([]);
      expect((section as any).elements).toEqual([]);
    });
  });

  describe('addElement', () => {
    it('should add an element when there are no duplicates', () => {
      const newElement = new ConfigElement<boolean>(
        'newElement',
        'New Element'
      );
      section.addElement(newElement);

      const expectedElements = [element1, element2, newElement];
      expect((section as any).elements).toEqual(expectedElements);
    });

    it('should throw ElementExistsException when adding a duplicate element', () => {
      const duplicateElement = new ConfigElement<string>(
        'element1',
        'Duplicate of element1'
      );

      expect(() => {
        section.addElement(duplicateElement);
      }).toThrow(ElementExistsException);

      expect(() => {
        section.addElement(duplicateElement);
      }).toThrow('Element with name element1 already exists');

      // Verify that the elements didn't change
      expect((section as any).elements).toEqual([element1, element2]);
    });
  });

  describe('getElements', () => {
    it('should return all elements', () => {
      const result = (section as any).getElements();
      expect(result).toEqual([element1, element2]);
    });
  });
});

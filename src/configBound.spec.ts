import { ConfigBound } from './configBound';
import { Section } from './section/section';
import { SectionExistsException } from './utilities/errors';

// Mock the Section class
jest.mock('./section/section', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Section: jest.fn().mockImplementation((name) => {
      return {
        name: name,
        configItems: [],
        setLogger: jest.fn(),
        setBindContext: jest.fn()
      };
    })
  };
});

/**
 * @group unit
 */
describe('ConfigBound', () => {
  let configBound: ConfigBound;
  let mockSection1: Section;

  beforeEach(() => {
    // Reset the mocks
    jest.clearAllMocks();

    mockSection1 = new Section('TestSection1', []);
    configBound = new ConfigBound('TestConfig', [], []);
  });

  describe('addSection', () => {
    it('should add a Section to the sections array', () => {
      const configBoundAny = configBound as any;

      // Arrange
      expect(configBoundAny.sections).toHaveLength(0);

      // Act
      configBound.addSection(mockSection1);

      // Assert
      expect(configBoundAny.sections).toHaveLength(1);
      expect(configBoundAny.sections[0]).toBe(mockSection1);
    });

    it('should add multiple Sections to the sections array', () => {
      // Arrange
      const configBoundAny = configBound as any;
      const mockSection2 = new Section('TestSection2', []);

      // Act
      configBound.addSection(mockSection1);
      configBound.addSection(mockSection2);

      // Assert
      expect(configBoundAny['sections']).toHaveLength(2);
      expect(configBoundAny.sections[0]).toBe(mockSection1);
      expect(configBoundAny.sections[1]).toBe(mockSection2);
    });

    it('should throw SectionExistsException when adding a section with the same name', () => {
      // Arrange
      const section1 = new Section('TestSection', []);
      const section2 = new Section('TestSection', []);
      configBound.addSection(section1);

      // Act & Assert
      expect(() => {
        configBound.addSection(section2);
      }).toThrow(SectionExistsException);
    });

    it('should allow adding a section with a different name', () => {
      // Arrange
      const section1 = new Section('Section1', []);
      const section2 = new Section('Section2', []);
      configBound.addSection(section1);

      // Act
      configBound.addSection(section2);

      // Assert
      expect(configBound.getSections()).toHaveLength(2);
      expect(configBound.getSections()[1]).toBe(section2);
    });
  });
});

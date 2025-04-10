import { ConfigBound } from './configBound';
import { ConfigSection } from './configSection';
import { SectionExistsException } from './errors';

// Mock the ConfigSection class
jest.mock('./configSection', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ConfigSection: jest.fn().mockImplementation((name) => {
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
  let mockConfigSection1: ConfigSection;

  beforeEach(() => {
    // Reset the mocks
    jest.clearAllMocks();

    mockConfigSection1 = new ConfigSection('TestSection1', []);
    configBound = new ConfigBound('TestConfig', [], []);
  });

  describe('addConfigSection', () => {
    it('should add a ConfigSection to the sections array', () => {
      const configBoundAny = configBound as any;

      // Arrange
      expect(configBoundAny.sections.length).toBe(0);

      // Act
      configBound.addConfigSection(mockConfigSection1);

      // Assert
      expect(configBoundAny.sections.length).toBe(1);
      expect(configBoundAny.sections[0]).toBe(mockConfigSection1);
    });

    it('should add multiple ConfigSections to the sections array', () => {
      // Arrange
      const configBoundAny = configBound as any;
      const mockConfigSection2 = new ConfigSection('TestSection2', []);

      // Act
      configBound.addConfigSection(mockConfigSection1);
      configBound.addConfigSection(mockConfigSection2);

      // Assert
      expect(configBoundAny['sections'].length).toBe(2);
      expect(configBoundAny.sections[0]).toBe(mockConfigSection1);
      expect(configBoundAny.sections[1]).toBe(mockConfigSection2);
    });

    it('should throw SectionExistsException when adding a section with the same name', () => {
      // Arrange
      const section1 = new ConfigSection('TestSection', []);
      const section2 = new ConfigSection('TestSection', []);
      configBound.addConfigSection(section1);

      // Act & Assert
      expect(() => {
        configBound.addConfigSection(section2);
      }).toThrow(SectionExistsException);
    });

    it('should allow adding a section with a different name', () => {
      // Arrange
      const section1 = new ConfigSection('Section1', []);
      const section2 = new ConfigSection('Section2', []);
      configBound.addConfigSection(section1);

      // Act
      configBound.addConfigSection(section2);

      // Assert
      expect(configBound.getSections().length).toBe(2);
      expect(configBound.getSections()[1]).toBe(section2);
    });
  });
});

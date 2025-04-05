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
        configItems: []
      };
    })
  };
});

describe('ConfigBound', () => {
  let configBound: any;
  let mockConfigSection: ConfigSection;

  beforeEach(() => {
    // Reset the mocks
    jest.clearAllMocks();

    // Create a new ConfigBound instance using any since constructor is private
    configBound = Object.create(ConfigBound.prototype);
    configBound.name = 'TestConfig';
    configBound.sections = [];

    // Create a mock ConfigSection
    mockConfigSection = new ConfigSection('TestSection', []);
  });

  describe('constructor', () => {
    it('should set the name and envVarPrefix correctly', () => {
      // Since constructor is private, use reflection
      const configBoundAny = ConfigBound as any;
      const instance = new configBoundAny('TestName', [], 'TEST_PREFIX_');

      expect(instance.name).toBe('TestName');
      // Test that the global envVarPrefix was set
      expect(require('./configBound').envVarPrefix).toBe('TEST_PREFIX_');
    });
  });

  describe('addConfigSection', () => {
    it('should add a ConfigSection to the sections array', () => {
      // Arrange
      expect(configBound.sections.length).toBe(0);

      // Act
      configBound.addConfigSection(mockConfigSection);

      // Assert
      expect(configBound.sections.length).toBe(1);
      expect(configBound.sections[0]).toBe(mockConfigSection);
    });

    it('should add multiple ConfigSections to the sections array', () => {
      // Arrange
      const mockConfigSection2 = new ConfigSection('TestSection2', []);

      // Act
      configBound.addConfigSection(mockConfigSection);
      configBound.addConfigSection(mockConfigSection2);

      // Assert
      expect(configBound.sections.length).toBe(2);
      expect(configBound.sections[0]).toBe(mockConfigSection);
      expect(configBound.sections[1]).toBe(mockConfigSection2);
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

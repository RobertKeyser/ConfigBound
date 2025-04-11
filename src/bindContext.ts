// The context interface
export interface BindContext {
  get<T>(sectionName: string, elementName: string): T | undefined;
}

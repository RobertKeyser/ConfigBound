# Introduction to ConfigBound

ConfigBound is a type-safe configuration management library designed for modern TypeScript applications. It provides a structured way to define, validate, and access configuration values throughout your application.

## Features

- **Type Safety**: Full TypeScript support with inferred types for your configuration values
- **Validation**: Built-in schema validation using Joi
- **Hierarchical Structure**: Organize configurations into logical sections
- **Runtime Safety**: Validate configuration values at runtime

## Quick Start

### Installation

```bash
npm install config-bound
```

### Basic Usage

```typescript
import { ConfigBound } from 'config-bound';
import { Section } from 'config-bound/section/section';
import { Element } from 'config-bound/element/element';
import { EnvVarBind } from 'config-bound/bind/binds/envVar';

// Create elements for server configuration
const portElement = new Element<number>('port', 'Server port', 3000);
const hostElement = new Element<string>('host', 'Server hostname', 'localhost');

// Create elements for logger configuration
const logLevelElement = new Element<string>('level', 'Log level', 'info');
const logFormatElement = new Element<string>('format', 'Log format', 'json');

// Create sections
const serverSection = new Section('server', [portElement, hostElement]);
const loggerSection = new Section('logger', [
  logLevelElement,
  logFormatElement
]);

// Create the ConfigBound instance
const appConfig = new ConfigBound(
  'app',
  [new EnvVarBind()],
  [serverSection, loggerSection]
);

// Access your configuration values
const serverPort = appConfig.get<number>('server', 'port');
console.log(`Server starting on port ${serverPort}`);
```

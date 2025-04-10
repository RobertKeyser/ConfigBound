/* eslint-disable @typescript-eslint/no-explicit-any */

export const MASKED_TOKEN = '[MASKED]';

export interface Logger {
  trace?(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
  info(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  error(message: string, ...meta: any[]): void;
}

export class ConsoleLogger implements Logger {
  trace(message: string, ...meta: any[]): void {
    console.trace(message, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    console.debug(message, ...meta);
  }

  info(message: string, ...meta: any[]): void {
    console.info(message, ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    console.warn(message, ...meta);
  }

  error(message: string, ...meta: any[]): void {
    console.error(message, ...meta);
  }
}

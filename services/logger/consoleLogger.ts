import { ILoggerService } from "./logger.api";

class ConsoleLogger implements ILoggerService {
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

export const consoleLogger = new ConsoleLogger();

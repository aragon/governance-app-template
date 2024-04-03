/**
 * Represents a logger service that provides methods for logging different types of messages.
 */
export interface ILoggerService {
  /**
   * Logs an informational message.
   * @param message - The message to be logged.
   * @param context - Additional context information.
   */
  info(message: string, ...meta: any[]): void;

  /**
   * Logs a warning message.
   * @param message - The message to be logged.
   * @param context - Additional context information.
   */
  warn(message: string, ...meta: any[]): void;

  /**
   * Logs an error message.
   * @param message - The message to be logged.
   * @param context - Additional context information.
   */
  error(message: string, ...meta: any[]): void;

  /**
   * Logs a debug message.
   * @param message - The message to be logged.
   * @param context - Additional context information.
   */
  debug(message: string, ...meta: any[]): void;
}

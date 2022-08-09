import winston from 'winston';

/**
 * The logging interface
 */
interface Logger {
  /**
   * The logger
   */
  logger: winston.Logger;

  /**
   *
   * @param msg
   */
  debug(msg: string): void;

  /**
   *
   * @param msg
   */
  info(msg: string): void;

  /**
   *
   * @param msg
   */
  error(msg: string): void;
}

export default Logger;

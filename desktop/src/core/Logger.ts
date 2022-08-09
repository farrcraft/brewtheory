import winston from 'winston';
import path from 'path';

import LoggerInterface from '../interfaces/core/Logger';

class Logger implements LoggerInterface {
  logger: winston.Logger;

  constructor(userDataPath: string) {
    const logPath = path.normalize(
      path.join(userDataPath, 'notekeeper-client.log')
    );

    const loggerTransports: Array<
      | winston.transports.FileTransportInstance
      | winston.transports.ConsoleTransportInstance
    > = [];
    loggerTransports.push(new winston.transports.File({ filename: logPath }));
    if (process.env.NODE_ENV === 'development') {
      loggerTransports.push(new winston.transports.Console());
    }

    const loggerOptions: winston.LoggerOptions = {
      level: 'debug',
      transports: loggerTransports,
    };
    this.logger = winston.createLogger(loggerOptions);
  }

  debug(msg: string): void {
    this.logger.debug(msg);
  }

  info(msg: string): void {
    this.logger.info(msg);
  }

  error(msg: string): void {
    this.logger.error(msg);
  }
}

export default Logger;

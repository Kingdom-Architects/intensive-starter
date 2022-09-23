// eslint-disable-next-line no-shadow
export enum LogLevel {
  Debug,
  Info,
  Error,
  Warn,
}

export class Logger {
  private readonly logs: [];

  constructor() {
    this.logs = [];
  }

  _logMessage(level: LogLevel, log: any) {
    console.log(level, log);
    // this.logs.push({ message: log, level });
  }

  debug(log: any) {
    this._logMessage(LogLevel.Debug, log);
  }

  error(log: any) {
    this._logMessage(LogLevel.Error, log);
  }

  info(log: any) {
    this._logMessage(LogLevel.Info, log);
  }

  warn(log: any) {
    this._logMessage(LogLevel.Warn, log);
  }

  flush() {
    this.logs.length = 0;
  }
}

import { Logger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class GlobalLogger extends Logger {
  log(message: string, context?: string) {
    super.log(message, context || 'GlobalLogger');
  }

  error(message: string, trace: string, context?: string) {
    super.error(message, trace, context || 'GlobalLogger');
  }

  warn(message: string, context?: string) {
    super.warn(message, context || 'GlobalLogger');
  }

  debug(message: string, context?: string) {
    super.debug(message, context || 'GlobalLogger');
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context || 'GlobalLogger');
  }

  customLog(message: string, context?: string) {
    console.log(`[CustomLog] ${message}`, context);
  }
}

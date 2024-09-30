import { Logger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class GlobalLogger extends Logger {
  // Override the default logging methods
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

  // You can add custom logic, e.g., sending logs to an external service
  customLog(message: string, context?: string) {
    // Add custom behavior here (e.g., send logs to a monitoring service)
    console.log(`[CustomLog] ${message}`, context);
  }
}

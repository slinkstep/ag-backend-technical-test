import { Module, Global } from '@nestjs/common';
import { GlobalLogger } from './global.logger.service';

@Global()
@Module({
  providers: [GlobalLogger],
  exports: [GlobalLogger],
})
export class LoggerModule {}

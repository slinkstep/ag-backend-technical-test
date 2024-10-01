import { Module, Global } from '@nestjs/common';
import { SSMConfigService } from './services/ssm.config.cache.service';

@Global()
@Module({
  providers: [SSMConfigService],
  exports: [SSMConfigService],
})
export class CustomConfigModule {}

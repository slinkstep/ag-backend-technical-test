import { Module, Global } from '@nestjs/common';
import { SSMConfigService } from './services/ssm.config.cache.service'; // Adjust the path as needed

@Global()
@Module({
  providers: [SSMConfigService],
  exports: [SSMConfigService],
})
export class CustomConfigModule {}

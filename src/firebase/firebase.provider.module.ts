import { Module, Global } from '@nestjs/common';
import { FirebaseProviderService } from './services/firebase.provider.service';

@Global()
@Module({
  providers: [FirebaseProviderService],
  exports: [FirebaseProviderService],
})
export class FirebaseModule {}

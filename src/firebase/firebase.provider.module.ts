import { Module, Global } from '@nestjs/common';
import { FirebaseProviderService } from './services/firebase.provider.service';
import { FirebaseErrorMapper } from './services/firebase.error.map.service';

@Global()
@Module({
  providers: [FirebaseProviderService, FirebaseErrorMapper],
  exports: [FirebaseProviderService],
})
export class FirebaseModule {}

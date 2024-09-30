import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'auth/guards/auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'logger/logger.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'test_secret',
      signOptions: { expiresIn: '60s' },
    }),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

    AppService,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'auth/guards/auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { getConstSSMEnvConfig } from 'config/services/ssm.config.const';
import { SequelizeModule } from '@nestjs/sequelize';
import { getDatabaseConfigFromSSM } from 'config/services/ssm.db.config';
import { CustomConfigModule } from 'config/custom.config.module';

@Module({
  imports: [
    LoggerModule,
    CustomConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [getConstSSMEnvConfig],
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: 'test_secret',
      signOptions: { expiresIn: '60s' },
    }),
    SequelizeModule.forRootAsync({
      name: 'default',
      useFactory: async () => await getDatabaseConfigFromSSM(),
    }),
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

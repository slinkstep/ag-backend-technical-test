import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from './logger/logger.module';
import { CustomConfigModule } from './config/custom.config.module';
import { ConfigModule } from '@nestjs/config';
import { getConstSSMEnvConfig } from './config/services/ssm.config.const';
import { JwtModule } from '@nestjs/jwt';
import { SSMConfigService } from './config/services/ssm.config.cache.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { getDatabaseConfigFromSSM } from './config/services/ssm.db.config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { User } from 'sequelize/models';
import { FirebaseModule } from './firebase/firebase.provider.module';
import { UsersModule } from './users/users.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthGuard } from './auth/guards/auth.guard';

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
    JwtModule.registerAsync({
      imports: [CustomConfigModule],
      useFactory: async (ssmConfigService: SSMConfigService) => {
        const secret = await ssmConfigService.getConfigValue(
          '/ag-backend-test/auth/authSecret',
        );
        return {
          secret,
          signOptions: { expiresIn: '60s' },
        };
      },
      inject: [SSMConfigService],
      global: true,
    }),
    SequelizeModule.forRootAsync({
      name: 'default',
      useFactory: async () => await getDatabaseConfigFromSSM(),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    SequelizeModule.forFeature([User]),
    FirebaseModule,
    UsersModule,
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

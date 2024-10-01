import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { AdminService } from './services/admin.service';
import { AdminResolver } from './resolvers/admin.resolver';
import { Admin } from 'sequelize/models';

import { AdminsRepository } from './repositories/admin.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Admin]), AuthModule],
  providers: [AdminService, AdminsRepository, AdminResolver],
})
export class AdminModule {}

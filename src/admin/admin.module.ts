import { forwardRef, Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { AdminService } from './services/admin.service';
import { AdminResolver } from './resolvers/admin.resolver';
import { Admin } from 'sequelize/models';

import { UsersModule } from 'src/users/users.module';
import { AdminsRepository } from './repositories/admin.repository';

@Module({
  imports: [SequelizeModule.forFeature([Admin]), forwardRef(() => UsersModule)],
  providers: [AdminService, AdminsRepository, AdminResolver],
  exports: [AdminService, AdminsRepository],
})
export class AdminModule {}

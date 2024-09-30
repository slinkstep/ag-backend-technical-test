import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'sequelize/models';
import { UsersRepository } from './repositories/users.repository';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), forwardRef(() => AdminModule)],
  providers: [UsersService, UsersRepository, UsersResolver],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

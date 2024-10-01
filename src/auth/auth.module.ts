import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.provider.module';
import { AuthService } from './services/auth.service';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { AdminsRepository } from 'src/admin/repositories/admin.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin, User } from 'sequelize/models';

@Module({
  imports: [FirebaseModule, SequelizeModule.forFeature([User, Admin])],
  providers: [AuthService, UsersRepository, AdminsRepository],
  exports: [AuthService],
})
export class AuthModule {}

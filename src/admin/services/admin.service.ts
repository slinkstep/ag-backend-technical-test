import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/auth/enums/role.enum';
import { FirebaseProviderService } from 'src/firebase/services/firebase.provider.service';
import { RegisterAdminInput } from 'graphql/inputs/admin/register.admin.input';
import { Admin } from 'sequelize/models';
import { LoginUserInput } from 'graphql/inputs/user/login.user.input';
import { AuthResponseAdmin } from 'graphql/dto/login.response.admin.dto';
import { AdminsRepository } from '../repositories/admin.repository';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { ResetUserPasswordResponse } from 'graphql/dto/reset-user-password.response.user.dto';
import { UserStatus } from 'sequelize/models/enums/enums';

@Injectable()
export class AdminService {
  constructor(
    private adminsRepository: AdminsRepository,
    private firebaseService: FirebaseProviderService,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async registerUser(input: RegisterAdminInput): Promise<Admin> {
    const createdAdminAuthProvider = await this.authService.createUser(
      input.authProviderEmail,
      input.password,
      input.name,
      Role.Admin,
    );

    const createAdminDto: CreateAdminDto = {
      name: input.name,
      authProviderEmail: input.authProviderEmail,
      authProviderId: createdAdminAuthProvider.uid,
    };

    const admin = await this.adminsRepository.createAdmin(createAdminDto);

    return admin;
  }

  async loginUser(input: LoginUserInput): Promise<AuthResponseAdmin> {
    const admin = await this.adminsRepository.findByEmail(
      input.authProviderEmail,
    );

    if (!admin) {
      throw new UnauthorizedException('Admin not found.');
    }

    if (admin.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException('Admin is blocked');
    }

    const firebaseUser =
      await this.firebaseService.verifyUserWithEmailAndPassword(
        input.authProviderEmail,
        input.password,
      );

    if (
      !firebaseUser ||
      !firebaseUser['localId'] ||
      admin.authProviderEmail !== firebaseUser['email']
    ) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const token = await this.jwtService.signAsync({
      sub: admin.id,
      email: admin.authProviderEmail,
      roles: [Role.Admin],
    });

    return { admin, token };
  }

  async resetAdminPassword(email: string): Promise<ResetUserPasswordResponse> {
    const admin = await this.adminsRepository.findByEmail(email);

    if (!admin) {
      throw new UnauthorizedException('Admin not found.');
    }

    if (admin.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException('Admin is blocked');
    }

    const link = await this.authService.resetUserPassword(email);

    return { resetLink: link } as ResetUserPasswordResponse;
  }
}

import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

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

@Injectable()
export class AdminService {
  constructor(
    private adminsRepository: AdminsRepository,
    private firebaseService: FirebaseProviderService,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async registerUser(input: RegisterAdminInput): Promise<Admin> {
    try {
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
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Register failed');
    }
  }

  async loginUser(input: LoginUserInput): Promise<AuthResponseAdmin> {
    const admin = await this.adminsRepository.findByEmail(
      input.authProviderEmail,
    );

    if (!admin) {
      throw new UnauthorizedException('Admin not found.');
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
}

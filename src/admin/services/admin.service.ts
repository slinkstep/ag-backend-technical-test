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
import { UsersRepository } from 'src/users/repositories/users.repository';
import { CreateAdminDto } from '../dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private adminsRepository: AdminsRepository,
    private usersRepository: UsersRepository,
    private firebaseService: FirebaseProviderService,
    private jwtService: JwtService,
  ) {}

  async registerUser(input: RegisterAdminInput): Promise<Admin> {
    try {
      // Check if admin already exists
      const existingAdmin = await this.adminsRepository.findByEmail(
        input.authProviderEmail,
      );

      if (existingAdmin) {
        throw new UnauthorizedException('Admin already exists');
      }

      const existingUser = await this.usersRepository.findByEmail(
        input.authProviderEmail,
      );

      if (existingUser) {
        throw new UnauthorizedException('Email already exists as user account');
      }

      const createdAdmin =
        await this.firebaseService.createUserWithEmailAndPassword(
          input.authProviderEmail,
          input.password,
          input.name,
        );

      if (!createdAdmin) {
        throw new InternalServerErrorException(
          'Failed to create admin in authentication service.',
        );
      }

      const createAdminDto: CreateAdminDto = {
        name: input.name,
        authProviderEmail: input.authProviderEmail,
        authProviderId: createdAdmin.uid,
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
    // Retrieve user from the database
    const admin = await this.adminsRepository.findByEmail(
      input.authProviderEmail,
    );

    if (!admin) {
      throw new UnauthorizedException('Admin not found.');
    }

    // Authenticate with Firebase
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

    // Generate JWT token
    const token = await this.jwtService.signAsync({
      sub: admin.id,
      email: admin.authProviderEmail,
      roles: [Role.Admin],
    });

    return { admin, token };
  }
}

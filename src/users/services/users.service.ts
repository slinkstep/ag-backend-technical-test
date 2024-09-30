import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { GlobalLogger } from 'src/logger/global.logger.service';
import { User } from 'sequelize/models';

import { RegisterUserInput } from 'graphql/inputs/user/register.user.input';
import { LoginUserInput } from 'graphql/inputs/user/login.user.input';
import { AuthResponse } from 'graphql/dto/login.response.user.dto';
import { Role } from 'src/auth/enums/role.enum';
import { FirebaseProviderService } from 'src/firebase/services/firebase.provider.service';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { AdminsRepository } from 'src/admin/repositories/admin.repository';

@Injectable()
export class UsersService {
  constructor(
    private firebaseService: FirebaseProviderService,
    private jwtService: JwtService,
    private logger: GlobalLogger,
    private usersRepository: UsersRepository,
    private adminsRepository: AdminsRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findById(id);
  }

  async registerUser(input: RegisterUserInput): Promise<User> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findByEmail(
      input.authProviderEmail,
    );

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const existingAdmin = await this.adminsRepository.findByEmail(
      input.authProviderEmail,
    );

    if (existingAdmin) {
      throw new UnauthorizedException('Admin already exists');
    }

    const createdUser =
      await this.firebaseService.createUserWithEmailAndPassword(
        input.authProviderEmail,
        input.password,
        input.name,
      );

    if (!createdUser) {
      throw new InternalServerErrorException(
        'Failed to create user in authentication service.',
      );
    }

    // Create user DTO
    const createUserDto: CreateUserDto = {
      name: input.name,
      authProviderEmail: input.authProviderEmail,
      authProviderId: createdUser.uid,
    };

    // Create user using the repository
    const user = await this.usersRepository.createUser(createUserDto);

    return user;
  }

  async loginUser(input: LoginUserInput): Promise<AuthResponse> {
    // Retrieve user from the database
    const user = await this.usersRepository.findByEmail(
      input.authProviderEmail,
    );

    if (!user) {
      throw new UnauthorizedException('User not found.');
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
      user.authProviderEmail !== firebaseUser['email']
    ) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Generate JWT token
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.authProviderEmail,
      roles: [Role.User],
    });

    return { user, token };
  }
}

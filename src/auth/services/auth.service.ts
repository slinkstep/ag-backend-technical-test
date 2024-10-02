import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { AdminsRepository } from 'src/admin/repositories/admin.repository';
import { FirebaseProviderService } from 'src/firebase/services/firebase.provider.service';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { Role } from '../enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly adminsRepository: AdminsRepository,
    private readonly firebaseService: FirebaseProviderService,
  ) {}

  async createUser(
    email: string,
    password: string,
    name: string,
    role: Role,
  ): Promise<UserRecord> {
    const checkOrder =
      role === Role.Admin ? [Role.Admin, Role.User] : [Role.User, Role.Admin];

    for (const check of checkOrder) {
      let exists: boolean;

      let message: string;

      if (check === Role.Admin) {
        exists = (await this.adminsRepository.findByEmail(email)) !== null;
        message = exists ? 'as admin account' : '';
      }

      if (check === Role.User) {
        exists = (await this.usersRepository.findByEmail(email)) !== null;
        message = exists ? 'as user account' : '';
      }

      if (exists) {
        throw new UnauthorizedException(`${role} already exists ${message}`);
      }
    }

    const createdUser =
      await this.firebaseService.createUserWithEmailAndPassword(
        email,
        password,
        name,
      );

    if (!createdUser) {
      throw new InternalServerErrorException(
        `Failed to create ${role} in authentication service.`,
      );
    }

    return createdUser;
  }

  async resetUserPassword(email: string): Promise<string> {
    const link = await this.firebaseService.requestUserPasswordReset(email);

    return link;
  }
}

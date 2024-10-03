import {
  BadRequestException,
  Injectable,
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
import { ResetUserPasswordResponse } from 'graphql/dto/reset-user-password.response.user.dto';
import { BetStatus, UserStatus } from 'sequelize/models/enums/enums';
import { SettlementRequestInput } from 'graphql/inputs/admin/settle.bet.admin.input';
import { SettlementRequestResponse } from 'graphql/dto/settle.bet.response.admin.dto';
import { RollbackRequestInput } from 'graphql/inputs/admin/rollback.bet.admin.input';
import { RollbackRequestResponse } from 'graphql/dto/rollback.bet.response.admin.dto';
import { BetRepository } from 'src/bets/repositories/bet.repository';

@Injectable()
export class AdminService {
  constructor(
    private adminsRepository: AdminsRepository,
    private firebaseService: FirebaseProviderService,
    private jwtService: JwtService,
    private authService: AuthService,
    private betsRepository: BetRepository,
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

  async requestSettlement(
    input: SettlementRequestInput,
  ): Promise<SettlementRequestResponse> {
    const { roundId, chance } = input;

    const firestore = this.firebaseService.getFirestore();
    const settlementDocRef = firestore.collection('settlements').doc(roundId);

    await settlementDocRef.set(
      {
        roundId,
        chance,
        finished: true,
        settlementProcessed: false,
        trigerRollBack: false,
        // rollbacked: false,
        // settlementDate: null,
        // settlements: null,
        // rollbacks: null,
        // rollbackDate: null,
        // trigerRollBack: false
      },
      { merge: true },
    );

    return {
      success: true,
      message: 'Settlement request submitted successfully',
    };
  }

  async requestRollback(
    input: RollbackRequestInput,
  ): Promise<RollbackRequestResponse> {
    const { roundId } = input;

    const firestore = this.firebaseService.getFirestore();
    const settlementDocRef = firestore.collection('settlements').doc(roundId);

    const doc = await settlementDocRef.get();
    if (!doc.exists) {
      throw new BadRequestException('Invalid roundId');
    }

    const data = doc.data();
    if (!data.settlementProcessed || !data.finished || data.trigerRollBack) {
      throw new BadRequestException('Cannot trigger rollback for this round');
    }

    // Ensure there are no open bets before triggering rollback
    const openBets = await this.betsRepository.findByRoundIdAndStatus(
      roundId,
      BetStatus.OPEN,
    );
    if (openBets.length > 0) {
      // trigger settlement again

      await settlementDocRef.set(
        {
          finished: true,
          settlementProcessed: false,
          trigerRollBack: false,
        },
        { merge: true },
      );

      throw new BadRequestException(
        'Cannot rollback, there are open bets for this round',
      );
    }

    // Update Firestore with rollback request
    await settlementDocRef.update({
      trigerRollBack: true,
      rollbacked: false,
    });

    return {
      success: true,
      message: 'Rollback request submitted successfully',
    };
  }
}

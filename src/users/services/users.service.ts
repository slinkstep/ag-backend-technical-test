import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Campaign, User } from 'sequelize/models';
import { RegisterUserInput } from 'graphql/inputs/user/register.user.input';
import { LoginUserInput } from 'graphql/inputs/user/login.user.input';
import { AuthResponse } from 'graphql/dto/login.response.user.dto';
import { Role } from 'src/auth/enums/role.enum';
import { FirebaseProviderService } from 'src/firebase/services/firebase.provider.service';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { CampaignService } from 'src/campaigns/services/campaigns.service';
import { TransactionsService } from 'src/transactions/services/transactions.service';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import {
  BalanceType,
  TransactionCategory,
  TransactionStatus,
} from 'sequelize/models/enums/enums';

@Injectable()
export class UsersService {
  constructor(
    private firebaseService: FirebaseProviderService,
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
    private authService: AuthService,
    private campaignService: CampaignService,
    private transactionsService: TransactionsService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findById(id);
  }

  async registerUser(input: RegisterUserInput): Promise<User> {
    let campaign: Campaign = null;
    if (input.promoCode) {
      campaign = await this.campaignService.validatePromoCode(input.promoCode);
    }

    const createdUserAuthProvider = await this.authService.createUser(
      input.authProviderEmail,
      input.password,
      input.name,
      Role.User,
    );

    const createUserDto: CreateUserDto = {
      name: input.name,
      authProviderEmail: input.authProviderEmail,
      authProviderId: createdUserAuthProvider.uid,
      realBalance: campaign ? campaign.playableBalanceAmount : 0,
      bonusBalance: campaign ? campaign.bonusBalanceAmount : 0,
    };

    const user = await this.usersRepository.createUser(createUserDto);

    // Create campaign playableBalanceAmount transaction
    if (campaign && campaign.playableBalanceAmount) {
      const playableBalanceTransaction: CreateTransactionDto = {
        userId: user.id,
        amount: campaign.playableBalanceAmount,
        category: TransactionCategory.CAMPAIGN,
        status: TransactionStatus.APPROVED,
        balance: BalanceType.REAL_BALANCE,
        campaignId: campaign.id,
      };

      await this.transactionsService.createTransaction(
        playableBalanceTransaction,
      );
    }

    // Create campaign transaction
    if (campaign && campaign.bonusBalanceAmount) {
      const bonusBalanceTransaction: CreateTransactionDto = {
        userId: user.id,
        amount: campaign.bonusBalanceAmount,
        category: TransactionCategory.CAMPAIGN,
        status: TransactionStatus.APPROVED,
        balance: BalanceType.BONUS_BALANCE,
        campaignId: campaign.id,
      };

      await this.transactionsService.createTransaction(bonusBalanceTransaction);
    }

    return user;
  }

  async loginUser(input: LoginUserInput): Promise<AuthResponse> {
    const user = await this.usersRepository.findByEmail(
      input.authProviderEmail,
    );

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

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

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.authProviderEmail,
      roles: [Role.User],
    });

    return { user, token };
  }
}

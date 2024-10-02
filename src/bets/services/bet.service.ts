import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateBetInput } from 'graphql/inputs/bet/bet.input';
import { Bet } from 'sequelize/models';
import {
  BalanceType,
  BetStatus,
  TransactionCategory,
  TransactionStatus,
  UserStatus,
} from 'sequelize/models/enums/enums';
import { SSMConfigService } from 'src/config/services/ssm.config.cache.service';
import { CreateBetDto } from '../dto/create-bet.dto';
import { BetRepository } from '../repositories/bet.repository';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import { TransactionsRepository } from 'src/transactions/repositores/transactions.repository';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { Sequelize } from 'sequelize';
import { InjectConnection } from '@nestjs/sequelize';
import { GlobalLogger } from 'src/logger/global.logger.service';

@Injectable()
export class BetService {
  constructor(
    private readonly ssmConfigService: SSMConfigService,
    private betsRepository: BetRepository,
    private transactionsRepository: TransactionsRepository,
    private usersRepository: UsersRepository,
    @InjectConnection() private readonly sequelize: Sequelize,
    private logger: GlobalLogger,
  ) {}

  async getBetById(id: number): Promise<Bet> {
    const bet = await this.betsRepository.findById(id);

    return bet;
  }

  async getAllBets(): Promise<Bet[]> {
    return this.betsRepository.findAll();
  }

  async createBet(input: CreateBetInput, userId: number): Promise<Bet> {
    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.usersRepository.findById(userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.status === UserStatus.BLOCKED) {
        throw new UnauthorizedException('User is blocked');
      }

      const balanceField = input.isBonus ? 'bonusBalance' : 'realBalance';
      const balanceType = input.isBonus ? 'bonus' : 'real';

      if (user[balanceField] < input.amount) {
        throw new BadRequestException(`Insufficient ${balanceType} balance`);
      }

      const margin =
        Number(
          await this.ssmConfigService.getConfigValue(
            '/ag-backend-test/app/betMargin',
          ),
        ) || 0.05;

      if (input.simulateSettlement) {
        // Reduce user balance

        user[balanceField] -= input.amount;
        await user.save({ transaction });

        const isWin = Math.random() < input.chance;

        let payout = 0;
        if (isWin) {
          payout = input.amount * (1 / input.chance) * margin;
          payout = Number(payout.toFixed(2)); // Round payout to 2 decimal digits

          // If type of balance is bonus, just pay the net profit
          if (input.isBonus) {
            payout = payout - input.amount;
          }

          user.realBalance += payout; // Add the payout to user's balance
        }

        const betDTO: CreateBetDto = {
          userId: user.id,
          amount: input.amount,
          chance: input.chance,
          payout: payout,
          margin: margin,
          roundId: input.roundId,
          win: isWin,
          status: BetStatus.SETTLED,
          isBonus: input.isBonus,
        };

        // Create the bet
        const bet = await this.betsRepository.create(betDTO, transaction);

        // Create the bet transaction
        const betTransactionDto: CreateTransactionDto = {
          userId: user.id,
          amount: input.amount,
          category: TransactionCategory.BET,
          status: TransactionStatus.APPROVED,
          balance: input.isBonus
            ? BalanceType.BONUS_BALANCE
            : BalanceType.REAL_BALANCE,
          betId: bet.id,
        };

        await this.transactionsRepository.createTransaction(
          betTransactionDto,
          transaction,
        );

        if (isWin) {
          // Create the win bet transaction
          const winTransactionDto: CreateTransactionDto = {
            userId: user.id,
            amount: payout,
            category: TransactionCategory.PROFIT,
            status: TransactionStatus.APPROVED,
            balance: BalanceType.REAL_BALANCE,
            betId: bet.id,
          };

          await this.transactionsRepository.createTransaction(
            winTransactionDto,
            transaction,
          );
        }

        await transaction.commit();

        return bet;
      }

      const betDto: CreateBetDto = {
        userId: user.id,
        amount: input.amount,
        chance: input.chance,
        roundId: input.roundId,
        status: BetStatus.OPEN,
        margin,
        isBonus: input.isBonus,
      };

      const bet = await this.betsRepository.create(betDto, transaction);

      // Create the bet transaction
      const betTransactionDto: CreateTransactionDto = {
        userId: user.id,
        amount: input.amount,
        category: TransactionCategory.BET,
        status: TransactionStatus.APPROVED,
        balance: input.isBonus
          ? BalanceType.BONUS_BALANCE
          : BalanceType.REAL_BALANCE,
        betId: bet.id,
      };

      await this.transactionsRepository.createTransaction(
        betTransactionDto,
        transaction,
      );

      user[balanceField] -= input.amount;
      await user.save({ transaction });

      await transaction.commit();

      return bet;
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      this.logger.error('Failed to create bet', error);
      throw error;
    }
  }

  async getBestBetPerUser(limit: number): Promise<Bet[]> {
    return await this.betsRepository.getBestBetPerUser(limit);
  }
}

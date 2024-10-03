import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Bet } from 'sequelize/models';
import { CreateBetDto } from '../dto/create-bet.dto';
import { Sequelize, Transaction } from 'sequelize';
import { BetStatus } from 'sequelize/models/enums/enums';

@Injectable()
export class BetRepository {
  constructor(
    @InjectModel(Bet) private readonly betModel: typeof Bet,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  async findById(id: number): Promise<Bet | null> {
    return await this.betModel.findByPk(id);
  }

  async findAll(): Promise<Bet[]> {
    return await this.betModel.findAll();
  }

  async create(input: CreateBetDto, transaction?: Transaction): Promise<Bet> {
    return await this.betModel.create(input, { transaction });
  }

  async getBestBetPerUser(limit: number): Promise<Bet[]> {
    const bets = await this.sequelize.query(
      `
      WITH RankedBets AS (
        SELECT b.*, 
               ROW_NUMBER() OVER (PARTITION BY b.user_id ORDER BY b.payout DESC, b.created_at DESC) AS rn
        FROM bets b
        WHERE b.payout IS NOT NULL
      )
      SELECT rb.id, rb.user_id, rb.amount, rb.payout, rb.round_id, rb.margin, rb.is_bonus, rb.win, rb.status, rb.created_at, rb.updated_at
      FROM RankedBets rb
      WHERE rn = 1
      LIMIT :limit
      `,
      {
        model: Bet,
        replacements: { limit },
        mapToModel: true,
      },
    );

    return bets;
  }

  async findByRoundIdAndStatus(
    roundId: string,
    status: BetStatus,
    transaction?: Transaction,
  ): Promise<Bet[]> {
    return await this.betModel.findAll({
      where: { roundId, status },
      transaction,
    });
  }
}

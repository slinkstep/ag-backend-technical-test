// src/bets/repositories/bet.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bet } from 'sequelize/models';
import { CreateBetDto } from '../dto/create-bet.dto';
import { Transaction } from 'sequelize';

@Injectable()
export class BetRepository {
  constructor(@InjectModel(Bet) private readonly betModel: typeof Bet) {}

  async findById(id: number): Promise<Bet | null> {
    return await this.betModel.findByPk(id);
  }

  async findAll(): Promise<Bet[]> {
    return await this.betModel.findAll();
  }

  async create(input: CreateBetDto, transaction?: Transaction): Promise<Bet> {
    return await this.betModel.create(input, { transaction });
  }
}

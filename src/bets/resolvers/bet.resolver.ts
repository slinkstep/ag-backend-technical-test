import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BetService } from '../services/bet.service';
import { BetType } from 'graphql/types/bet.type';
import { CreateBetInput } from 'graphql/inputs/bet/bet.input';

@Resolver(() => BetType)
export class BetResolver {
  constructor(private readonly betService: BetService) {}

  @Mutation(() => BetType)
  async createBet(
    @Args('createBetInput') createBetInput: CreateBetInput,
  ): Promise<BetType> {
    return this.betService.createBet(createBetInput);
  }
}

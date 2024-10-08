import { Resolver, Mutation, Args, Context, Query, Int } from '@nestjs/graphql';
import { BetService } from '../services/bet.service';
import { BetType } from 'graphql/types/bet.type';
import { CreateBetInput } from 'graphql/inputs/bet/bet.input';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => BetType)
export class BetResolver {
  constructor(private readonly betService: BetService) {}

  @Roles(Role.User)
  @Mutation(() => BetType)
  async createBet(
    @Args('input') createBetInput: CreateBetInput,
    @Context() context,
  ): Promise<BetType> {
    const user = context.req.user;

    if (!user || !user.sub) {
      throw new BadRequestException('Invalid user credentials.');
    }

    return this.betService.createBet(createBetInput, user.sub);
  }

  @Roles(Role.User)
  @Query(() => [BetType], { name: 'getBestBetPerUser' })
  async getBestBetPerUser(
    @Args('limit', { type: () => Int }) limit: number,
  ): Promise<BetType[]> {
    return this.betService.getBestBetPerUser(limit);
  }
}

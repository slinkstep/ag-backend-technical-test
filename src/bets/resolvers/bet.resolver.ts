import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BetService } from '../services/bet.service';
import { BetType } from 'graphql/types/bet.type';
import { CreateBetInput } from 'graphql/inputs/bet/bet.input';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';

@Resolver(() => BetType)
export class BetResolver {
  constructor(private readonly betService: BetService) {}

  @Roles(Role.User)
  @Mutation(() => BetType)
  async createBet(
    @Args('createBetInput') createBetInput: CreateBetInput,
  ): Promise<BetType> {
    return this.betService.createBet(createBetInput);
  }
}

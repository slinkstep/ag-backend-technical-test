import { Resolver, Query, Args, Int, Mutation, Context } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';

import { Public } from 'src/auth/decorators/auth.public.route.decorator';
import { RegisterUserInput } from 'graphql/inputs/user/register.user.input';
import { AuthResponse } from 'graphql/dto/login.response.user.dto';
import { LoginUserInput } from 'graphql/inputs/user/login.user.input';
import { UserType } from 'graphql/types/user.type';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ResetUserPasswordResponse } from 'graphql/dto/reset-user-password.response.user.dto';
import { UserClaimCampaignInput } from 'graphql/inputs/user/claim.campaign.user.input';
import { BadRequestException } from '@nestjs/common';
import { ClaimCampaignResponse } from 'graphql/dto/claim.campaign.response.user.dto';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Query(() => [UserType], { name: 'users' })
  async getUsers(): Promise<UserType[]> {
    return this.usersService.findAll();
  }

  @Roles(Role.Admin)
  @Query(() => UserType, { name: 'user' })
  async getUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserType> {
    return this.usersService.findById(id);
  }

  @Roles(Role.User)
  @Mutation(() => ClaimCampaignResponse, { name: 'userClaimCampaign' })
  async userClaimCampaign(
    @Args('input') input: UserClaimCampaignInput,
    @Context() context,
  ): Promise<ClaimCampaignResponse> {
    const user = context.req.user;

    if (!user || !user.sub) {
      throw new BadRequestException('Invalid user credentials.');
    }

    return this.usersService.claimCampaign(input, user.sub);
  }

  @Public()
  @Mutation(() => UserType)
  async registerUser(
    @Args('input') input: RegisterUserInput,
  ): Promise<UserType> {
    const user = await this.usersService.registerUser(input);
    return user;
  }

  @Public()
  @Query(() => ResetUserPasswordResponse, { name: 'resetUserPassword' })
  async resetUserPassword(
    @Args('email') email: string,
  ): Promise<ResetUserPasswordResponse> {
    return this.usersService.resetUserPassword(email);
  }

  @Public()
  @Mutation(() => AuthResponse)
  async loginUser(@Args('input') input: LoginUserInput): Promise<AuthResponse> {
    const authResponse = await this.usersService.loginUser(input);
    return authResponse;
  }
}

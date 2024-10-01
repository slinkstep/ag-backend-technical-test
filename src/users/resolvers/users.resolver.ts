import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';

import { Public } from 'src/auth/decorators/auth.public.route.decorator';
import { RegisterUserInput } from 'graphql/inputs/user/register.user.input';
import { AuthResponse } from 'graphql/dto/login.response.user.dto';
import { LoginUserInput } from 'graphql/inputs/user/login.user.input';
import { UserType } from 'graphql/types/user.type';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';

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

  @Public()
  @Mutation(() => UserType)
  async registerUser(
    @Args('input') input: RegisterUserInput,
  ): Promise<UserType> {
    const user = await this.usersService.registerUser(input);
    return user;
  }

  @Public()
  @Mutation(() => AuthResponse)
  async loginUser(@Args('input') input: LoginUserInput): Promise<AuthResponse> {
    const authResponse = await this.usersService.loginUser(input);
    return authResponse;
  }
}

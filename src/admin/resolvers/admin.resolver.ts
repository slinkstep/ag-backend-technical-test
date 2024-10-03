import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { Public } from 'src/auth/decorators/auth.public.route.decorator';

import { AdminService } from '../services/admin.service';
import { AdminType } from 'graphql/types/admin.type';
import { RegisterAdminInput } from 'graphql/inputs/admin/register.admin.input';
import { AuthResponseAdmin } from 'graphql/dto/login.response.admin.dto';
import { LoginAdminInput } from 'graphql/inputs/admin/login.admin.input';

import { ResetUserPasswordResponse } from 'graphql/dto/reset-user-password.response.user.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { SettlementRequestResponse } from 'graphql/dto/settle.bet.response.admin.dto';
import { SettlementRequestInput } from 'graphql/inputs/admin/settle.bet.admin.input';
import { RollbackRequestResponse } from 'graphql/dto/rollback.bet.response.admin.dto';
import { RollbackRequestInput } from 'graphql/inputs/admin/rollback.bet.admin.input';

@Resolver(() => AdminType)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Mutation(() => AdminType)
  async registerAdmin(
    @Args('input') input: RegisterAdminInput,
  ): Promise<AdminType> {
    const admin = await this.adminService.registerUser(input);
    return admin;
  }

  @Public()
  @Mutation(() => AuthResponseAdmin)
  async loginAdmin(
    @Args('input') input: LoginAdminInput,
  ): Promise<AuthResponseAdmin> {
    const authResponse = await this.adminService.loginUser(input);
    return authResponse;
  }

  @Public()
  @Query(() => ResetUserPasswordResponse, { name: 'resetAdminPassword' })
  async resetUserPassword(
    @Args('email') email: string,
  ): Promise<ResetUserPasswordResponse> {
    return this.adminService.resetAdminPassword(email);
  }

  // Mutation for requesting a settlement
  @Roles(Role.Admin)
  @Mutation(() => SettlementRequestResponse, { name: 'requestSettlement' })
  async requestSettlement(
    @Args('input') input: SettlementRequestInput,
  ): Promise<SettlementRequestResponse> {
    return await this.adminService.requestSettlement(input);
  }

  // Mutation for requesting a rollback
  @Roles(Role.Admin)
  @Mutation(() => RollbackRequestResponse, { name: 'requestRollback' })
  async requestRollback(
    @Args('input') input: RollbackRequestInput,
  ): Promise<RollbackRequestResponse> {
    return await this.adminService.requestRollback(input);
  }
}

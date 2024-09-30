import { Resolver, Args, Mutation } from '@nestjs/graphql';

import { Public } from 'src/auth/decorators/auth.public.route.decorator';

import { AdminService } from '../services/admin.service';
import { AdminType } from 'graphql/types/admin.type';
import { RegisterAdminInput } from 'graphql/inputs/admin/register.admin.input';
import { AuthResponseAdmin } from 'graphql/dto/login.response.admin.dto';
import { LoginAdminInput } from 'graphql/inputs/admin/login.admin.input';

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
}

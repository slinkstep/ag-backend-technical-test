import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'auth/decorators/auth.public.route.decorator';
import { Roles } from 'auth/decorators/role.decorator';
import { Role } from 'auth/enums/role.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Roles(Role.Admin, Role.User)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

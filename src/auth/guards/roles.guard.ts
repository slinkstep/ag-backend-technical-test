import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';
import { IS_PUBLIC_KEY } from '../decorators/auth.public.route.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const ctxType = context.getType().toString();

    let user: any;

    if (ctxType === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      user = gqlContext.req.user;
    } else {
      const request = context.switchToHttp().getRequest();
      user = request.user;
    }

    if (!user || !user.roles) {
      throw new ForbiddenException('Access denied: No roles found for user');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    return hasRole;
  }
}

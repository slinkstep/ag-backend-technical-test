import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/auth.public.route.decorator';
import { GlobalLogger } from 'src/logger/global.logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private logger: GlobalLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Determine if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Determine if the request is GraphQL or REST
    const ctxType = context.getType().toString();

    let request: Request;

    if (ctxType === 'graphql') {
      // For GraphQL requests
      const ctx = GqlExecutionContext.create(context);
      const gqlContext = ctx.getContext();
      request = gqlContext.req;
    } else {
      // For REST or other HTTP requests
      request = context.switchToHttp().getRequest();
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      // Attach the user payload to the request object
      request['user'] = payload;
    } catch (error) {
      this.logger.error('Auth guard error', error);

      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

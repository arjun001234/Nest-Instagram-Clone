import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { ExtendedRequest } from './users/interfaces/request.express';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authServices: AuthService,
    private userServices: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<ExtendedRequest>();
    if(!request.header('Authorization')){
      throw new UnauthorizedException();
    }
    const token = request.header('Authorization').replace('Bearer ', '');
    const isValid = this.authServices.verifyToken(token);
    const id = (isValid as { id: number }).id;
    const userTokens = await this.userServices.getTokens(id);
    const isTokenOfUser = userTokens.filter((item) => item.token === token);
    if (!isValid || isTokenOfUser.length === 0) {
      throw new UnauthorizedException();
    }
    const user = await this.userServices.findOne(id);
    request.user = user;
    request.token = token;
    return true;
  }
}

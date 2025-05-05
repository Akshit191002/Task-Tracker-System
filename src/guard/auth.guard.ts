import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const bearer = request.headers['authorization']?.split(' ')[0];

    const token = request.headers['authorization']?.split(' ')[1];

    if (bearer != 'Bearer' || !token) throw new UnauthorizedException('invalid credentials');

    try {
      const verifyToken = this.jwtService.verify(token);
      request.userId = verifyToken.sub;
      return true;
    } catch (err) {
      throw new UnauthorizedException('invalid credentials');
    }
  }
}

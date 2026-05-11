import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard
  implements CanActivate
{
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context
      .switchToHttp()
      .getRequest();

    const authHeader =
      request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        'Token mancante',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded: any = jwt.verify(
        token,
        'SUPER_SECRET_JWT',
      );

      request.user = {
        userId:
          decoded.userId ||
          decoded.sub ||
          decoded.id,
      };

      return true;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException(
        'Token non valido',
      );
    }
  }
}
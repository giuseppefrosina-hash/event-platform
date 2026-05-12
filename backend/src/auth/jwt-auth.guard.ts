import {
  Injectable,
  CanActivate,
  ExecutionContext,
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
    try {
      const request =
        context
          .switchToHttp()
          .getRequest();

      const authHeader =
        request.headers.authorization;

      console.log(
        'AUTH HEADER:',
        authHeader,
      );

      if (!authHeader) {
        throw new UnauthorizedException(
          'Token mancante',
        );
      }

      const token =
        authHeader.split(' ')[1];

      console.log(
        'TOKEN:',
        token,
      );

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      );

      console.log(
        'DECODED:',
        decoded,
      );

      request.user = decoded;

      return true;
    } catch (err) {
      console.log(
        'JWT ERROR:',
        err,
      );

      throw new UnauthorizedException(
        'Token non valido',
      );
    }
  }
}
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
    const request =
      context.switchToHttp().getRequest();

    const authHeader =
      request.headers.authorization;

    console.log(
      'AUTH HEADER:',
      authHeader,
    );

    if (!authHeader) {
      throw new UnauthorizedException(
        'No token',
      );
    }

    const token =
      authHeader.split(' ')[1];

    console.log('TOKEN:', token);

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET ||
          'secret',
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
        'Invalid token',
      );
    }
  }
}
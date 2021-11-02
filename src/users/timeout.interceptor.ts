import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { ExtendedRequest } from './interfaces/request.express';
import { User } from './user.entity';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp().getRequest<ExtendedRequest>();

    return next.handle().pipe(
      timeout(10000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
      map((result: User[] | User) => {
        if(Array.isArray(result)){
          result.map((user) => {
            delete user.password
            delete user.email
            return user
          })
        }else{
          delete result.password
        }
          return result
        }))
  }
}

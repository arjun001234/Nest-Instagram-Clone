import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { RedisService } from 'src/redis/redis.service';
import { ExtendedRequest } from './interfaces/request.express';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(
    private redisService: RedisService
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<ExtendedRequest>();
    const key = request.user.id.toString();
    const value = request.user;
    const cachedData = await this.redisService.get(key);
    if (!cachedData) {
      await this.redisService.set(key, value, { ttl: 120 });
      return next.handle();
    } else {
      return of(cachedData);
    }
  }
}

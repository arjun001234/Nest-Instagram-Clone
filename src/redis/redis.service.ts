import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get(key): Promise<any> {
    return this.cache.get(key);
  }

  async set(key, value, options?: CachingConfig): Promise<void> {
    await this.cache.set(key, value, options);
  }
}

import { CacheModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import devConfig from 'config/configuration';
import { RedisConfigInterface } from 'config/interface/configuration.interface';

@Module({
    imports: [CacheModule.registerAsync({
        imports: [ConfigModule.forFeature(devConfig)],
        useFactory: async (configService: ConfigService) => ({
            store: redisStore,
            host: configService.get<RedisConfigInterface>('Redis').host,
            port: configService.get<RedisConfigInterface>('Redis').port
        }),
        inject: [ConfigService]
      }),ConfigModule],
    providers: [RedisService],
    exports: [RedisService]
})
export class RedisModule { 
}

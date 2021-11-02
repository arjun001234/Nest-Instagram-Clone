import { Module } from '@nestjs/common';;
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/exceptions.filters';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
import { Token } from './token.entity';
import { Photo } from 'src/photos/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Token,Photo]),AuthModule,RedisModule],
  controllers: [UsersController],
  providers: [UsersService,{
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }],
  exports: [UsersService]  
})
export class UsersModule {}

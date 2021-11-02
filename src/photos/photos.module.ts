import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AllExceptionsFilter } from 'src/exceptions.filters';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Photo } from './photo.entity';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';

@Module({
    imports: [TypeOrmModule.forFeature([Photo,User]),MulterModule.register({
        dest: './files',
    }),AuthModule,UsersModule,CloudinaryModule],
    providers: [PhotosService,{
        provide: APP_FILTER, 
        useClass: AllExceptionsFilter
      }], 
    controllers: [PhotosController]
})
export class PhotosModule {}

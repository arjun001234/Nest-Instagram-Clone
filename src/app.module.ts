import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PhotosModule } from './photos/photos.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import devConfig from 'config/configuration';

@Module({
  imports: [TypeOrmModule.forRoot(),UsersModule,PhotosModule, CloudinaryModule,ConfigModule.forRoot({
    load: [devConfig],
    isGlobal: true,
    cache: true
  })],
  providers: [CloudinaryService]
})
export class AppModule {} 

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import devConfig from 'config/configuration';
import { CloudinaryConfigInterface } from 'config/interface/configuration.interface';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule.forFeature(devConfig)],
  providers: [
    CloudinaryService,
    {
      provide: 'CLOUDINARY',
      useFactory: (configService: ConfigService) => {
        const config = configService.get<CloudinaryConfigInterface>('Cloudinary');
        return v2.config({
          cloud_name: config.cloud_name,
          api_key: config.api_key,
          api_secret: config.api_secret,
        });
      },
      inject: [ConfigService]
    }
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsOptional, IsString } from 'class-validator';
import { AuthGuard } from 'src/auth.guard';
import {
  CloudinaryDestroyResponse,
  CloudinaryService,
} from 'src/cloudinary/cloudinary.service';
import { AllExceptionsFilter } from 'src/exceptions.filters';
import { ExtendedRequest } from 'src/users/interfaces/request.express';
import { User } from 'src/users/user.entity';
import { MulterOptions } from './multer.utils';
import { Photo } from './photo.entity';
import { PhotosService } from './photos.service';

export class PhotoDto {
  @IsString()
  photo: string;
  @IsString()
  @IsOptional()
  caption: string;
}

@Controller('photos')
@UseFilters(AllExceptionsFilter)
export class PhotosController {
  constructor(
    private photosServices: PhotosService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar', new MulterOptions()))
  @UseGuards(AuthGuard)
  async createAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Query('caption') caption: string,
    @Req() request: ExtendedRequest,
  ){
    const url = await this.cloudinaryService.cloudinaryImageUpload(file);
    if (!url) {
      throw new HttpException(
        'Failed to upload.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.photosServices.addPhoto(
      url.secure_url,
      request.user, 
      url.public_id,
      caption
    );
  }

  @Get()
  getPhotos(): Promise<(Photo & User)[]> {
    return this.photosServices.findPhotos();
  }

  @Get('/my')
  @UseGuards(AuthGuard)
  getMyPhotos(@Req() request: ExtendedRequest): Promise<(Photo & User)[]> {
    return this.photosServices.findMyPosts(request.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: ExtendedRequest,
  ): Promise<Photo> {
    const userId =  request.user.id;
    const photo = await this.photosServices.findPhoto(id,userId);
    if (photo) {
      const response: CloudinaryDestroyResponse =
        await this.cloudinaryService.cloudinaryImageDelete(photo.filename);
      if (response.result !== 'ok') {
        throw new HttpException(
          'Deletion Failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException('No such photo exist.', HttpStatus.NOT_FOUND);
    }
    await this.photosServices.deletePhoto(id, request.user)
    return photo;
  }
}

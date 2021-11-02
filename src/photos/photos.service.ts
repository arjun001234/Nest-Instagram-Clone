import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiResponse } from 'cloudinary';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';

@Injectable()
export class PhotosService { 
  constructor(
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async addPhoto(photoUrl: string,user: User,filename: string,caption?: string) : Promise<Photo> {
    const photo = new Photo();
    photo.photo = photoUrl;
    photo.user = user;
    photo.filename = filename;
    if(caption){
      photo.caption = caption
    }
    await this.photoRepository.save(photo);
    return photo
  }

  findPhoto(id: number,userId: number) : Promise<Photo> {
    return this.photoRepository.findOne({id: id,user: {id: userId}});
  }

  findPhotos() : Promise<(Photo & User)[]>  {
    return this.photoRepository.createQueryBuilder("photo").leftJoinAndSelect("photo.user","user").select('*').execute();
  }

  async deletePhoto(id: number,user: User) : Promise<void>  {
    await this.photoRepository.delete({id: id,user: user});
  }

  findMyPosts(user: User) : Promise<(Photo & User)[]> {
    return this.usersRepository.createQueryBuilder("user").leftJoinAndSelect("user.photos","photo").andWhere("user.id = photo.userId").select('*').andWhere("user.id = :id",{id: user.id}).execute();
  }
}
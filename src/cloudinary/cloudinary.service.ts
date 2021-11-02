import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import * as path from 'path';

export class CloudinaryDestroyResponse {
    result: string
}

@Injectable()
export class CloudinaryService {
    async cloudinaryImageUpload(file: Express.Multer.File) : Promise<UploadApiResponse> {
        const filePath = path.resolve('files',file.filename);
        const response = await v2.uploader.upload(filePath);
        return response;
    }
    async cloudinaryImageDelete(filename: string) : Promise<CloudinaryDestroyResponse> {
        const response = await v2.uploader.destroy(filename);
        return response;
    }
}

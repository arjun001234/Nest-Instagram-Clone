import { MulterModuleOptions } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ExtendedRequest } from "src/users/interfaces/request.express";
import * as path from 'path';

export class MulterOptions implements MulterModuleOptions{
    storage = diskStorage({
        destination: './files',
        filename: (req: ExtendedRequest,file,cb) => {
            const fileExt = path.extname(file.originalname);
            const filename = `${req.user.id}-${req.user.name}.${fileExt}`;
            cb(null,filename)
        }
    })
    fileFilter = (req,file,callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
    }
}
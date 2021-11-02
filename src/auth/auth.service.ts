import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private my_secret : jwt.Secret;
    private saltRounds = 10;
    
    constructor(private configService:ConfigService){
        this.my_secret = this.configService.get<string>('Jwt_Secret');
    }

    generateToken(id: number) {
        return jwt.sign({id: id},this.my_secret);
    }

    verifyToken(token) {
        return jwt.verify(token,this.my_secret);
    }

    async hash(password: string) : Promise<string> {
        const hashedPassword = await bcrypt.hash(password,this.saltRounds);
        return hashedPassword;
    }

    async compareHashedPassword(hashValue: string, password: string) : Promise<void> {
        const isPasswordValid = bcrypt.compare(password,hashValue);
        if(!isPasswordValid){
            throw new HttpException('Invalid Password',HttpStatus.UNAUTHORIZED);
        }
    }
}

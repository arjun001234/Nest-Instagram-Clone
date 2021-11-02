import { IsJWT } from "class-validator";
import { User } from "../user.entity";

export class TokenDto {
    @IsJWT()
    token: string
    user: User
}
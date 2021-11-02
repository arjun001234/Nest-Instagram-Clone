import { OmitType, PartialType } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class NewUserDto {
    @IsString()
    name: string;
    @IsEmail()
    email: string;
    @IsNumber()
    @IsOptional()
    age: number;
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'password too weak',
    })
    password: string;
}

export class updateUserDto extends PartialType(NewUserDto) {}

export class loginUserDto extends OmitType(NewUserDto,["age","name"]) {}
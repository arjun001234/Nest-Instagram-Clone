import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {

  private validationOptions: ValidatorOptions = {
    skipMissingProperties: true,
    forbidNonWhitelisted: true,
  };

  constructor(options?: ValidatorOptions) {
    if(options){
      this.validationOptions = options;
    }
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object, this.validationOptions);
    if (errors.length > 0) {
      errors.map((error) => {
        throw new HttpException(error.property,HttpStatus.BAD_REQUEST);
      });
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

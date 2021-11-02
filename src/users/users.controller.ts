import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AllExceptionsFilter } from '../exceptions.filters';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { ValidationPipe } from '../validation.pipe';
import { AuthGuard } from 'src/auth.guard';
import { ExtendedRequest } from './interfaces/request.express';
import { RedisCacheInterceptor } from './rediscache.interceptor';
import { ExtendedResponse } from './interfaces/extended.response';
import { TimeoutInterceptor } from './timeout.interceptor';
import { loginUserDto, NewUserDto, updateUserDto } from './dto/user.dto';

@Controller('users')
@UseFilters(AllExceptionsFilter)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser( 
    @Body(new ValidationPipe()) newUser: NewUserDto,
  ): Promise<ExtendedResponse> {
    return this.usersService.create(newUser);
  }

  @Post('/login')
  login(
    @Body(new ValidationPipe()) user: loginUserDto,
  ): Promise<ExtendedResponse> {
    return this.usersService.login(user);
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() request: ExtendedRequest){
    const user = request.user;
    await this.usersService.logout(request.user.id,request.token);
    return user;
  }

  @Post('/logoutall')
  @UseGuards(AuthGuard)
  async logoutAll(@Req() request: ExtendedRequest){
    const user = request.user;
    await this.usersService.logoutAll(request.user.id);
    return user;
  }

  @Get()
  @UseInterceptors(TimeoutInterceptor)
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/search')
  @UseInterceptors(TimeoutInterceptor)
  searchUser(@Query('name') name: string): Promise<User[]> {
    return this.usersService.findByName(name);
  }

  @Get('/me')
  @UseInterceptors(RedisCacheInterceptor, TimeoutInterceptor)
  @UseGuards(AuthGuard)
  getMe(@Req() request: ExtendedRequest): User {
    const user = request.user;
    return user;
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateMe(
    @Body(new ValidationPipe()) body: updateUserDto,
    @Req() request: ExtendedRequest,
  ): Promise<User> {
    return this.usersService.updateUser(request.user.id, body);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteMe(@Req() request: ExtendedRequest): Promise<User> {
    const user = request.user;
    await this.usersService.deleteUser(user.id);
    return user;
  }
}

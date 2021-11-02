import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Photo } from 'src/photos/photo.entity';
import { Repository } from 'typeorm';
import { TokenDto } from './dto/token.dto';
import { loginUserDto, NewUserDto, updateUserDto } from './dto/user.dto';
import { ExtendedResponse } from './interfaces/extended.response';
import { Token } from './token.entity';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    @InjectRepository(Photo) private photosRepository: Repository<Photo>,
    @Inject('AuthService') private authServices: AuthService,
  ) {}

  async create(user: NewUserDto): Promise<ExtendedResponse> {
    user.password = await this.authServices.hash(user.password);
    const newUser = (await this.usersRepository.save(user)) as User;
    const token = this.authServices.generateToken(newUser.id);
    await this.setTokens({
      token: token,
      user: newUser,
    });
    return {
      user: newUser,
      token: token,
    };
  }

  async login(loginCredentials: loginUserDto): Promise<ExtendedResponse> {
    const user = await this.usersRepository.findOne({
      email: loginCredentials.email,
    });
    if (!user) {
      throw new HttpException('Invalid Email', HttpStatus.UNAUTHORIZED);
    }
    const isValid = this.authServices.compareHashedPassword(
      user.password,
      loginCredentials.password,
    );
    if (!isValid) {
      throw new HttpException('Invalid Password', HttpStatus.UNAUTHORIZED);
    }
    const token = this.authServices.generateToken(user.id);
    await this.setTokens({
      token: token,
      user: user,
    });
    return {
      user: user,
      token: token,
    };
  }

  async logout(id: number,token: string){
    this.tokenRepository.delete({token: token, user: {id: id}});
  }

  async logoutAll(id: number){
    this.tokenRepository.delete({user: {id: id}});
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ id: id });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findByName(name: string): Promise<User[]> {
    return this.usersRepository.find({ where: { name: name } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.tokenRepository.delete({ user: { id: id } });
    await this.photosRepository.delete({ user: { id: id } });
    await this.usersRepository.delete({ id: id });
  }

  async updateUser(id: number, newValues: updateUserDto): Promise<User> {
    const me = await this.findOne(id);
    if (newValues.name) {
      me.name = newValues.name;
    }
    if (newValues.email) {
      me.email = newValues.email;
    }
    await this.usersRepository
      .createQueryBuilder()
      .update<User>(User)
      .set(me)
      .where('id = :id', { id: id })
      .execute();
    return me;
  }
  async setTokens(newToken: TokenDto): Promise<void> {
    const token = new Token();
    token.token = newToken.token;
    token.user = newToken.user;
    await this.tokenRepository.save(token);
  }
  async getTokens(id: number): Promise<Token[]> {
    return this.tokenRepository.find({ user: { id: id } });
  }
}

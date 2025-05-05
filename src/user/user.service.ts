import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { userData, userDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/user-login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(userData.name) private UserModel: Model<userDocument>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    const user = await this.UserModel.findOne({ email: createUserDto.email });

    if (user) {
      return 'user already exist';
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const model = new this.UserModel({
      ...createUserDto,
      password: hashedPassword,
    });
    await model.save();
    return 'successfully creating account';
  }

  async login(loginDto: loginDto): Promise<object | string> {
    const user = await this.UserModel.findOne({ email: loginDto.email });
    const isPassword = await bcrypt.compare(loginDto.password, user!.password);
    if (!user || !isPassword) {
      return 'invalid credentials';
    }

    const data = { email: user.email, sub: user._id };

    const secret = this.configService.get<string>('JWT_SECRET');
    const token = this.jwtService.sign(data, {
      secret,
      expiresIn: '1h',
    });
    return {
      msg: 'user successfully login..',
      token: token,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'sequelize/models';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async findById(id: number): Promise<User> {
    return await this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: { authProviderEmail: email },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.create(createUserDto);
  }
}

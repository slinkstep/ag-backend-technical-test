import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'sequelize/models';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getHello(): Promise<string> {
    const users = await this.userModel.findByPk(1);
    const plainUser = users.get({ plain: true });
    console.log('users', plainUser);
    return 'Hello World!';
  }
}

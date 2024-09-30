import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from 'sequelize/models';
import { CreateAdminDto } from '../dto/create-admin.dto';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectModel(Admin)
    private adminModel: typeof Admin,
  ) {}

  async findAll(): Promise<Admin[]> {
    return this.adminModel.findAll();
  }

  async findById(id: number): Promise<Admin> {
    return this.adminModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ where: { authProviderEmail: email } });
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminModel.create(createAdminDto);
  }
}

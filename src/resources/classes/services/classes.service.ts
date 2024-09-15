import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Class } from '../models/class.model';
import { CreateClassDto } from '../dtos/create-class.dto';
import * as moment from 'moment';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class)
    private classModel: typeof Class,
  ) {}

  async findAll(): Promise<Class[]> {
    return await this.classModel.findAll();
  }

  async findOne(id: string): Promise<Class> {
    const classModel = await this.classModel.findOne({
      where: {
        id,
      },
    });

    if (!classModel) {
      throw new NotFoundException('Class not found');
    }

    return classModel;
  }

  async create(data: CreateClassDto): Promise<Class> {
    const { startDate, endDate, name, description } = data;

    return await this.classModel.create({
      name,
      description,
      start_date: startDate,
      end_date: endDate,
    });
  }

  async update(classId: string, data: CreateClassDto): Promise<Class> {
    const { name, description, startDate, endDate } = data;

    let classModel = await this.classModel.findOne({
      where: { id: classId },
    });

    if (!classModel) {
      throw new NotFoundException('Class not found');
    }

    classModel.name = name;
    classModel.description = description;
    classModel.start_date = moment(startDate).toDate();
    classModel.end_date = moment(endDate).toDate();

    return await classModel.save();
  }

  async remove(id: string): Promise<void> {
    const classModel = await this.classModel.findByPk(id);

    if (!classModel) {
      throw new NotFoundException('Class not found');
    }

    await classModel.destroy();
  }
}

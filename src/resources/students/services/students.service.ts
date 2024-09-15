import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../models/student.model';
import { Class } from '../../classes/models/class.model';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UniqueConstraintError } from 'sequelize';

const moment = require('moment');

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student)
    private studentModel: typeof Student,
    @InjectModel(Class)
    private classModel: typeof Class,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentModel.findAll();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findOne({
      where: {
        id,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async create(student: CreateStudentDto): Promise<Student> {
    try {
      return await this.studentModel.create({
        first_name: student.firstName,
        last_name: student.lastName,
        email: student.email,
        date_of_birth: student.dateOfBirth,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException('email already exists');
      }
      throw error;
    }
  }

  async update(studentId: string, data: CreateStudentDto): Promise<Student> {
    const { firstName, lastName, email, dateOfBirth } = data;

    let student = await this.studentModel.findOne({ where: { id: studentId } });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    student.first_name = firstName;
    student.last_name = lastName;
    student.email = email;
    student.date_of_birth = moment(dateOfBirth);

    return await student.save();
  }

  async remove(id: string): Promise<void> {
    const student = await this.studentModel.findByPk(id);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await student.destroy();
  }

  async enroll(studentId: string, classId: string): Promise<void> {
    const student = await this.studentModel.findByPk(studentId);
    const classModel = await this.classModel.findByPk(classId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (!classModel) {
      throw new NotFoundException('Class not found');
    }

    const [existingStudentClass] = await student.getClasses({
      where: { id: classId },
    });

    if (existingStudentClass) {
      throw new ConflictException('Student is already enrolled in this class');
    }

    await student.addClass(classModel);
  }

  async unenroll(studentId: string, classId: string): Promise<void> {
    const student = await this.studentModel.findByPk(studentId);
    const classModel = await this.classModel.findByPk(classId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (!classModel) {
      throw new NotFoundException('Class not found');
    }

    const [existingStudentClass] = await student.getClasses({
      where: { id: classId },
    });

    if (!existingStudentClass) {
      throw new ConflictException(
        'The student is not enrolled in the specified class',
      );
    }

    await student.removeClass(classModel);
  }

  async getClasses(id: string) {
    const student = await this.studentModel.findByPk(id, {
      include: {
        association: 'classes',
        through: { attributes: [] },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student.classes;
  }
}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from './models/student.model';
import { StudentsController } from './controllers/students.controller';
import { StudentsService } from './services/students.service';
import { StudentClass } from '../student_class/models/student-class.model';
import { Class } from '../classes/models/class.model';
import { IsDateNotInFuture } from '../../validators/isDateNotInFuture.validator';
import { IsDateFormatValid } from '../../validators/isDateFormatValid.validator';

@Module({
  imports: [SequelizeModule.forFeature([Student, StudentClass, Class])],
  providers: [StudentsService, IsDateNotInFuture, IsDateFormatValid],
  controllers: [StudentsController],
})
export class StudentsModule {}

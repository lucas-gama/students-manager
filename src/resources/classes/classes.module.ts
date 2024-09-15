import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Class } from './models/class.model';
import { ClassesController } from './controllers/classes.controller';
import { ClassesService } from './services/classes.service';
import { StudentClass } from '../student_class/models/student-class.model';
import { IsDateNotBeforeDate } from '../../validators/isDateNotBeforeDate.validator';
import { IsDateFormatValid } from '../../validators/isDateFormatValid.validator';

@Module({
  imports: [SequelizeModule.forFeature([Class, StudentClass])],
  providers: [ClassesService, IsDateNotBeforeDate, IsDateFormatValid],
  controllers: [ClassesController],
})
export class ClassesModule {}

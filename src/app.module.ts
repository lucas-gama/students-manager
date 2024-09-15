import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentsModule } from './resources/students/student.module';
import { ClassesModule } from './resources/classes/classes.module';
import { dbConfig } from './database/config/database';

@Module({
  imports: [SequelizeModule.forRoot(dbConfig), StudentsModule, ClassesModule],
})
export class AppModule {}

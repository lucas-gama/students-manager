import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Class } from '../../resources/classes/models/class.model';
import { Student } from '../../resources/students/models/student.model';
import { StudentClass } from '../../resources/student_class/models/student-class.model';

export const dbConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'challenge',
  define: {
    timestamps: true,
    underscored: true
  },
  models: [Student, Class, StudentClass],
};

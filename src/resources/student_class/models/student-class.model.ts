import {
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Class } from '../../classes/models/class.model';
import { Student } from '../../students/models/student.model';

@Table({ tableName: 'student_class' })
export class StudentClass extends Model {
  @ForeignKey(() => Student)
  @Column
  student_id: number;

  @ForeignKey(() => Class)
  @Column
  class_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

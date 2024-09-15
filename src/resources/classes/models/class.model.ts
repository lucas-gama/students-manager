import {
  BelongsToMany,
  Column,
  CreatedAt,
  IsDate,
  Length,
  Model,
  NotEmpty,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { StudentClass } from '../../student_class/models/student-class.model';
import { Student } from '../../students/models/student.model';

@Table({ tableName: 'class' })
export class Class extends Model {
  @NotEmpty
  @Length({
    msg: 'name must be between 1 and 20 characters',
    min: 1,
    max: 20,
  })
  @Column
  name: string;

  @Length({
    msg: 'description must be no longer than 30 characters',
    max: 30,
  })
  @Column
  description: string;

  @NotEmpty
  @IsDate
  @Column
  start_date: Date;

  @NotEmpty
  @IsDate
  @Column
  end_date: Date;

  @BelongsToMany(() => Student, () => StudentClass)
  students: Student[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}

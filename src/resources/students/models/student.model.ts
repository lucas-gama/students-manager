import {
  AllowNull,
  BelongsToMany,
  Column,
  CreatedAt,
  IsDate,
  IsEmail,
  Length,
  Model,
  NotEmpty,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Class } from '../../classes/models/class.model';
import { StudentClass } from '../../student_class/models/student-class.model';

@Table({ tableName: 'student' })
export class Student extends Model {
  @AllowNull(false)
  @NotEmpty
  @Length({
    msg: 'first_name must be between 1 and 20 characters',
    min: 1,
    max: 20,
  })
  @Column
  first_name: string;

  @AllowNull(false)
  @NotEmpty
  @Length({
    msg: 'first_name must be between 1 and 20 characters',
    min: 1,
    max: 20,
  })
  @Column
  last_name: string;

  @Unique(true)
  @NotEmpty
  @AllowNull(false)
  @IsEmail
  @Column
  email: string;

  @AllowNull(false)
  @NotEmpty
  @IsDate
  @Column
  date_of_birth: Date;

  @BelongsToMany(() => Class, () => StudentClass)
  classes: Class[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  // Declares the addClass/removeClass methods so TypeScript recognizes them, as Sequelize dynamically adds this association method at runtime.
  public addClass!: (classModel: Class) => Promise<void>;
  public removeClass!: (classModel: Class) => Promise<void>;
  public getClasses!: (opts: any) => Promise<Class[]>;
}

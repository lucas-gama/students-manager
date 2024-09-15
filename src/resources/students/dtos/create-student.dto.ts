import { IsEmail, Length, Validate } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsDateNotInFuture } from '../../../validators/isDateNotInFuture.validator';
import { IsDateFormatValid } from '../../../validators/isDateFormatValid.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @Length(1, 20, {
    message: 'first_name must be between 1 and 20 characters',
  })
  @ApiProperty({
    name: 'first_name',
    example: 'Lucas',
    maxLength: 20,
    minLength: 1,
  })
  @Expose({
    name: 'first_name',
  })
  firstName: string;

  @Expose({
    name: 'last_name',
  })
  @ApiProperty({
    name: 'last_name',
    example: 'Gama',
    maxLength: 20,
    minLength: 1,
  })
  @Length(1, 20, {
    message: 'last_name must be between 1 and 20 characters',
  })
  lastName: string;

  @ApiProperty({ example: 'lucas@gmail.com', uniqueItems: true })
  @IsEmail()
  email: string;

  @Expose({
    name: 'date_of_birth',
  })
  @ApiProperty({
    name: 'date_of_birth',
    format: 'YYYY-MM-DD',
    example: '1997-08-15',
  })
  @Validate(IsDateFormatValid)
  @Validate(IsDateNotInFuture)
  dateOfBirth: string;
}

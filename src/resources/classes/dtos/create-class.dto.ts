import { Length, MaxLength, Validate } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsDateNotBeforeDate } from '../../../validators/isDateNotBeforeDate.validator';
import { IsDateFormatValid } from '../../../validators/isDateFormatValid.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @Length(1, 20, {
    message: 'name must be between 1 and 20 characters',
  })
  @ApiProperty({ example: 'Portuguese', minLength: 1, maxLength: 20 })
  name: string;

  @MaxLength(30, {
    message: 'description must be no longer than 30 characters',
  })
  @ApiProperty({
    example: 'Study of Portuguese language',
    maxLength: 30,
  })
  description: string;

  @Validate(IsDateFormatValid)
  @ApiProperty({
    name: 'start_date',
    format: 'YYYY-MM-DD',
    example: '2024-09-11',
  })
  @Expose({
    name: 'start_date',
  })
  startDate: string;

  @Validate(IsDateFormatValid)
  @Validate(IsDateNotBeforeDate, ['startDate'])
  @ApiProperty({
    name: 'end_date',
    format: 'YYYY-MM-DD',
    example: '2024-10-11',
  })
  @Expose({
    name: 'end_date',
  })
  endDate: string;
}

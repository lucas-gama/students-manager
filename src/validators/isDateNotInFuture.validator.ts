import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';
import { API_DATE_FORMAT } from '../constants/dateFormat';
import { camelToSnake } from '../utils/string/string-utils';

@ValidatorConstraint({ name: 'isDateNotInFuture', async: false })
export class IsDateNotInFuture implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments) {
    const format = API_DATE_FORMAT;
    const parsedDate = moment(date, format, true);

    // Ignoring validation if date is invalid, so the "isDateFormatValid" validator deals with it
    if (!parsedDate.isValid()) {
      return true;
    }

    const isAfterCurrentDate = parsedDate.isAfter(moment().format(format));
    return !isAfterCurrentDate;
  }

  defaultMessage(args: ValidationArguments) {
    const formattedValue = camelToSnake(args.property);

    return `${formattedValue} can't be greater than the current date`;
  }
}

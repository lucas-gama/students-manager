import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';
import { API_DATE_FORMAT } from '../constants/dateFormat';
import { camelToSnake } from '../utils/string/string-utils';

@ValidatorConstraint({ name: 'isDateNotBeforeDate', async: false })
export class IsDateNotBeforeDate implements ValidatorConstraintInterface {
  validate(endDate: string, args: ValidationArguments) {
    const startDate = (args.object as any)[args.constraints[0]];
    const format = API_DATE_FORMAT;
    const parsedStartDate = moment(startDate, format, true);
    const parsedEndDate = moment(endDate, format, true);

    // Ignoring validation if startDate/endDate is invalid, so the "isDateFormatValid" validator deals with it
    if (!parsedStartDate.isValid()) {
      return true;
    }

    if (!parsedEndDate.isValid()) {
      return true;
    }

    return !parsedEndDate.isBefore(parsedStartDate);
  }

  defaultMessage(args: ValidationArguments) {
    const formattedEndDate = camelToSnake(args.property);
    const formattedStartDate = camelToSnake(args.constraints[0]);

    return `${formattedEndDate} can't be earlier than ${formattedStartDate}`;
  }
}

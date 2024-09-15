import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';
import { API_DATE_FORMAT } from '../constants/dateFormat';
import { camelToSnake } from '../utils/string/string-utils';

@ValidatorConstraint({ name: 'isDateFormatValid', async: false })
export class IsDateFormatValid implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments) {
    const format = API_DATE_FORMAT;
    const parsedDate = moment(date, format, true);

    return parsedDate.isValid();
  }

  defaultMessage(args: ValidationArguments) {
    const formattedValue = camelToSnake(args.property);

    return `${formattedValue} should be in ${API_DATE_FORMAT} format`;
  }
}

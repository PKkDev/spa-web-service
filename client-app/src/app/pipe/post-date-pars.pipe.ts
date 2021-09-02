import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'PostDateParsPipe'
})
export class PostDateParsPipe implements PipeTransform {

  transform(value?: string): string {
    console.log(value);

    if (value == '' || value == undefined)
      return '';

    // 2021-01-21T12:22:23
    // YYY-MM-DDTHH:mm:ss
    moment.locale('ru');
    var result = moment(value, 'YYY-MM-DDTHH:mm:ss').format('D MMMM HH:mm');

    return result;
  }

}

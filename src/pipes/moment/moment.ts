import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'moment',
    pure: false
})
export class MomentPipe implements PipeTransform {

    transform(d: Date | moment.Moment, args?: any[]): string {
        return moment(d).format(args[0]);
    }
}

@Pipe({
    name: 'timeAgo',
    pure: false
})

export class TimeAgoPipe implements PipeTransform {
    transform(d: Date | moment.Moment): string {
        return moment(d).fromNow();
    }
}

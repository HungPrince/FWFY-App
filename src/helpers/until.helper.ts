import { Injectable } from "@angular/core";

@Injectable()
export class UntilHelper {
    niceString(stringVal: string) {
        return stringVal ? stringVal.trim() : '';
    }

    parseDate(date) {
        return date.moment().format('ll');
    }

    convertJsonToArray(obj) {
        return Object.keys(obj).map((k) => { return obj[k] });
    }
}

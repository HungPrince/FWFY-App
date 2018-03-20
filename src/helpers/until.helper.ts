import { Injectable } from "@angular/core";


@Injectable()
export class UntilHelper {
    niceString(stringVal: string) {
        return stringVal ? stringVal.trim() : '';
    }
}

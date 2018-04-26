import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
    data: any;
    dataChange: Observable<any>;
    dataChangeObserver: any;

    constructor() {
        this.dataChange = new Observable((observer: any) => {
            this.dataChangeObserver = observer;
        });
    }

    setData(data: any) {
        this.data = data;
        this.dataChangeObserver.next(this.data);
    }
}
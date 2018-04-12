import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
    currentUser: any;
    dataChange: Observable<any>;
    dataChangeObserver: any;
  
    constructor() {
      this.dataChange = new Observable((observer: any) => {
        this.dataChangeObserver = observer;
      });
    }
  
    setData(data:any) {
        this.currentUser = data;
        this.dataChangeObserver.next(this.currentUser);
    }
  }
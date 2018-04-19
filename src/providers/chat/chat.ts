import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatProvider {
    constructor(private af: AngularFireDatabase) {
    }

    getListChat(key: string) {
        return this.af.database.ref('post').child(key).child('comments').once('value', data => { return data; });
    }

    pushChat(key: string, message: any) {
        return this.af.database.ref('post').child(key).child('comments').push(message);
    }
}

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatProvider {
    constructor(private af: AngularFireDatabase) {
    }

    getListComment(key: string): Observable<any> {
        return this.af.list(`post/${key}/comments`).valueChanges();
    }

    pushComment(key: string, message: any) {
        return this.af.database.ref('post').child(key).child('comments').push(message);
    }

    getListChat(userFrom: string, postId: string): Observable<any> {
        return this.af.list(`post/${postId}/chat/${userFrom}`).valueChanges();
    }

    pushChat(userFrom: string, postId: string, message: any) {
        return this.af.database.ref(`post/${postId}/chat/${userFrom}`).push(message);
    }

    getListUserChat(postId: string): Observable<any> {
        return this.af.list(`post/${postId}/chat`).valueChanges();
    }
}

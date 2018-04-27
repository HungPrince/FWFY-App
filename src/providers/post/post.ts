import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostProvider {

    constructor(
        public af: AngularFireDatabase) { }

    getAll(): Observable<any> {
        return this.af.list('post').snapshotChanges().
            map(posts => { return posts.map(post => ({ key: post.key, ...post.payload.val() })) });
    }

    add(post: any) {
        return this.af.database.ref('post').push(post);
    }

    update(post: any) {
        return this.af.database.ref(`post`).child(post.key).update(post);
    }

    delete(post: any) {
        return this.af.database.ref('post').child(post.key).remove();
    }
}

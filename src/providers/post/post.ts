import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { AutoCompleteService } from 'ionic2-auto-complete';
import { ADDRESS } from '../../configs/data';

@Injectable()
export class PostProvider implements AutoCompleteService {

    private address = ADDRESS;
    constructor(public af: AngularFireDatabase) {
    }

    getResults(keywords: string) {
        return this.address.filter(item => item[0].name.toLowerCase().startsWith(keywords).toLowerCase());
    }

    getAll(): Observable<any> {
        return this.af.list('post').snapshotChanges().
            map(posts => { return posts.map(post => ({ key: post.key, ...post.payload.val() })) });
    }

    add(post: any) {
        return this.af.database.ref('post').push(post);
    }

    update(post: any) {
        return this.af.database.ref(`post/${post.key}`).set(post);
    }

    delete(post: any) {
        return this.af.database.ref('post').child(post.key).remove();
    }
}

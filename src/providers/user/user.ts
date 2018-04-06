import { Injectable } from '@angular/core';

import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';

import { User } from '../../models/user';
import { Observable } from "rxjs/Observable";

@Injectable()
export class UserProvider {

    constructor(public af: AngularFireDatabase, private afAuth: AngularFireAuth) {

    }

    getAll(): Observable<any> {
        return this.af.list('users').snapshotChanges().
            map(users => { return users.map(user => ({ uid: user.key, ...user.payload.val() })) });
    }

    getUserPagination(index: number): any {
        return this.af.database.ref('users').orderByKey().limitToFirst(index).once('value', data => { return data; });
    }

    getUserPaginationNext(key: string, index: number): any {
        return this.af.database.ref("users").orderByKey().startAt(key).limitToFirst(index).once("value", (data) => { return data; });
    }

    getUserByKey(key: string): any {
        return this.af.database.ref(`users/${key}`).once('value', data => { return data });
    }

    update(user: any) {
        return this.af.database.ref(`users/${user.uid}`).update(user);
    }

    register(password: string, user: User): any {
        return this.afAuth.auth.createUserWithEmailAndPassword(user.email, password).then((auth) => {
            return this.af.database.ref('users').child(auth.uid).set(user, (error) => {
                if (!error) {
                    return true;
                } else {
                    console.log(error);
                }
            }).catch((e) => console.log(e));
        }).catch((e) => console.log(e));
    }
}
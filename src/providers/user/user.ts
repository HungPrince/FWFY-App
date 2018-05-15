import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";

@Injectable()
export class UserProvider {

    constructor(public af: AngularFireDatabase, private afAuth: AngularFireAuth) {

    }

    getAll(): Observable<any> {
        return this.af.list('users').snapshotChanges().
            map(users => { return users.map(user => ({ uid: user.key, ...user.payload.val() })) });
    }

    getApplicant(): Observable<any> {
        return this.af.list('users').snapshotChanges().
            map(users => { return users.map(user => ({ uid: user.key, ...user.payload.val() })) });
    }

    getUserPagination(index: number): any {
        return this.af.database.ref('users').orderByKey().limitToFirst(index).once('value', data => { return data.val(); });
    }

    getUserPaginationNext(key: string, index: number): any {
        return this.af.database.ref("users").orderByKey().startAt(key).limitToFirst(index).once("value", (data) => { return data.val(); });
    }

    getUserByKey(key: string): any {
        return this.af.database.ref(`users/${key}`).once('value', data => { return data });
    }

    update(user: any) {
        return this.af.database.ref(`users/${user.uid}`).update(user);
    }

    register(email: string, password: string): any {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    create(user: any): any {
        return this.af.database.ref('users').child(user.uid).set(user);
    }

    delete(user: any) {
        return this.af.database.ref('users').child(user.uid).remove();
    }

    pushCV(cv: any): any {
        return this.af.database.ref('cv').push(cv);
    }
}

import { Injectable } from '@angular/core';
import { MESSAGE_REGISTER_SUCCESS } from '../../configs/constants';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../../models/user';

@Injectable()
export class UserProvider {

    constructor(private af: AngularFireDatabase, private afAuth: AngularFireAuth) {

    }

    register(password: string, user: User): any {
        this.afAuth.auth.createUserWithEmailAndPassword(user.email, password).then((auth) => {
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

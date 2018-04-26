import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

@Injectable()
export class NetService {
    constructor(
    ) {
    }

    checkNetwork(): any {
        return firebase.database().ref(".info/connected").on("value", snap => { console.log(snap.val()); return snap.val(); });
    }
}

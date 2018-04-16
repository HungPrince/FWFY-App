import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

@Injectable()
export class NetService {
    constructor(
    ) {
    }

    checkNetwork() {
        let connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                alert("connected");
            } else {
                alert("not connected");
            }
        });
    }
}

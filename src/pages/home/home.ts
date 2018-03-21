import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController, public storage: Storage, public menuCtrl: MenuController, ) {

    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

    public logout() {
        this.storage.set('auth', null);
        this.navCtrl.push(LoginPage);
    }

}

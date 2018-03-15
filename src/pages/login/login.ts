import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { RegisterPage } from './../register/register';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    constructor(public navCtrl: NavController, public menuCtrl: MenuController) {

    }

    ionViewWillEnter() {
        this.menuCtrl.enable(false);
    }

    signup() {
        this.navCtrl.push(RegisterPage);
    }

    doLogin() {
    }
}

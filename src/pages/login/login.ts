import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { UntilHelper } from '../../helpers/until.helper';

import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

import { RegisterPage } from './../register/register';
@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    private formLogin;
    private emailRegex = "^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$";
    constructor(public navCtrl: NavController, public menuCtrl: MenuController,
        private afAuth: AngularFireAuth, private storage: Storage, public formBuilder: FormBuilder,
        private untilHelpr: UntilHelper) {
        this.storage.get('auth').then(data => {
            if (data) {
                this.navCtrl.setRoot(HomePage);
            }
        }).catch(e => console.log(e));
        this.formLogin = this.formBuilder.group({
            'email': new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)]),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(25)])),
            'rememberCbx': new FormControl(true)
        })
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(false);
    }

    signup() {
        this.navCtrl.push(RegisterPage);
    }

    doLogin() {
        var email = this.untilHelpr.niceString(this.formLogin.value.email);
        var password = this.untilHelpr.niceString(this.formLogin.value.password);
        this.afAuth.auth.signInWithEmailAndPassword(email, password).then(data => {
            this.storage.set('auth', data);
            console.log(data);
            this.navCtrl.setRoot(HomePage);
        }).catch(e => console.log(e));
    }
}

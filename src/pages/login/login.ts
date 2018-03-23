import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, AlertController } from 'ionic-angular';
import { Validators, FormControl, FormBuilder } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';

import { LoaderService } from '../../services/loaderService';
import { ToastService } from '../../services/toastService';

import { UntilHelper } from '../../helpers/until.helper';
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
    private googleProvider = new firebase.auth.GoogleAuthProvider();
    private facebookProvider = new firebase.auth.FacebookAuthProvider();

    constructor(public navCtrl: NavController, public menuCtrl: MenuController, public alerCtrl: AlertController,
        public loaderService: LoaderService, public toastService: ToastService,
        private afAuth: AngularFireAuth, private af: AngularFireDatabase, private storage: Storage, public formBuilder: FormBuilder,
        private untilHelpr: UntilHelper) {

        this.storage.get('accountUser').then(user => {
            if (user) {
                this.formLogin = this.formBuilder.group({
                    'email': new FormControl(user.email, [Validators.required, Validators.pattern(this.emailRegex)]),
                    'password': new FormControl(user.password, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(25)])),
                    'rememberCbx': new FormControl(true)
                });
            }
        });

        this.storage.get('auth').then(data => {
            if (data) {
                this.navCtrl.setRoot(HomePage);
            }
        }).catch(e => console.log(e));

        this.formLogin = this.formBuilder.group({
            'email': new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)]),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(25)])),
            'rememberCbx': new FormControl(true)
        });
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(false);
    }

    ngAfterViewInit() {
        let tabs = document.querySelectorAll('.show-tabbar');
        if (tabs !== null) {
            Object.keys(tabs).map((key) => {
                tabs[key].style.display = 'none';
            });
        }
    }

    signup() {
        this.navCtrl.push(RegisterPage);
    }

    doLogin() {
        var email = this.untilHelpr.niceString(this.formLogin.value.email);
        var password = this.untilHelpr.niceString(this.formLogin.value.password);
        this.afAuth.auth.signInWithEmailAndPassword(email, password).then(result => {
            if (this.formLogin.value.rememberCbx) {
                this.storage.set('accountUser', { email: email, password: password });
            } else {
                this.storage.set('accountUser', null);
            }
            this.storage.set('auth', result.uid);
            this.navCtrl.setRoot(HomePage);
        }).catch(e => { this.toastService.toast(e.message, 1000, 'middle', false) });
    }

    doGoogleLogin() {
        firebase.auth().signInWithPopup(this.googleProvider).then((result) => {
            var user = {
                name: result.user.displayName,
                email: result.user.email,
                phone: {
                    phone1: result.user.phoneNumber
                },
                avatar_url: result.user.photoURL,
                type: 'goolge',
            };
            this.af.database.ref('users').child(result.user.uid).set(user).then((error) => {
                if (!error) {
                    this.storage.set('auth', result.user.uid);
                    this.navCtrl.setRoot(HomePage);
                }
            }).catch((error) => console.log(error));
        }).catch((error) => console.log(error));
    }

    doFacebookLogin() {
        firebase.auth().signInWithPopup(this.facebookProvider).then((result) => {
            var user = {
                name: result.user.displayName,
                email: result.user.email,
                phone: {
                    phone1: result.user.phoneNumber
                },
                avatar_url: result.user.photoURL,
                type: 'goolge',
            };
            this.af.database.ref('users').child(result.user.uid).set(user).then((error) => {
                if (!error) {
                    this.storage.set('auth', result.user.uid);
                    this.navCtrl.setRoot(HomePage);
                }
            }).catch((error) => console.log(error));
        }).catch((error) => console.log(error));
    }

    forgotPassword() {
        let alertForgotPass = this.alerCtrl.create({
            title: 'Forgot Password',
            message: 'A new password will be sent to your email',
            inputs: [
                {
                    name: 'email',
                    placeholder: 'Enter your email',
                    type: 'email'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('cancel clicked');
                    }
                },
                {
                    text: 'Submit',
                    handler: data => {
                        this.loaderService.loaderNoSetTime('Reseting password')
                        this.afAuth.auth.sendPasswordResetEmail(data.email).then(data => {
                            this.loaderService.dismisLoader().then(() => {
                                this.toastService.toast('Reset password successfully!', 1000, 'bottom', false);
                            })
                        }).catch(error => {
                            this.loaderService.dismisLoader().then(() => {
                                this.toastService.toast(error.message, 1000, 'bottom', false);
                            })
                            return false;
                        });
                    }
                }
            ]
        });
        alertForgotPass.present();
    }
}

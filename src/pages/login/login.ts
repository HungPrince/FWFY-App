import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, AlertController, Events } from 'ionic-angular';
import { Validators, FormControl, FormBuilder } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';

import { LoaderService } from '../../services/loaderService';
import { ToastService } from '../../services/toastService';

import { UntilHelper } from '../../helpers/until.helper';
import { TabsPage } from '../tabs/tabs';

import { RegisterPage } from './../register/register';
import { UserProvider } from '../../providers/user/user';
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

    constructor(public navCtrl: NavController,
        public menuCtrl: MenuController,
        public alerCtrl: AlertController,
        public loaderService: LoaderService,
        public toastService: ToastService,
        private afAuth: AngularFireAuth,
        private af: AngularFireDatabase,
        private storage: Storage,
        public formBuilder: FormBuilder,
        private userProvider: UserProvider,
        private untilHelpr: UntilHelper,
        private events: Events,
    ) {
        this.storage.get('accountUser').then(user => {
            if (user) {
                this.formLogin = this.formBuilder.group({
                    'email': new FormControl(user.email, [Validators.required, Validators.pattern(this.emailRegex)]),
                    'password': new FormControl(user.password, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(25)])),
                    'rememberCbx': new FormControl(true)
                });
            }
        });

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
        this.loaderService.loaderNoSetTime('login');
        this.afAuth.auth.signInWithEmailAndPassword(email, password).then(result => {
            if (this.formLogin.value.rememberCbx) {
                this.storage.set('accountUser', { email: email, password: password });

            } else {
                this.storage.set('accountUser', null);
            }
            this.userProvider.getUserByKey(result.uid).then(user => {
                let userI = user.val();
                userI.uid = result.uid;
                this.storage.set('auth', userI).then(data => {
                    this.navCtrl.setRoot(TabsPage);
                    this.events.publish('userLoggedIn', userI);
                    this.loaderService.dismisLoader();
                });
            });
        }).catch(e => { this.loaderService.dismisLoader(); this.toastService.toast(e.message, 1000, 'middle', false) });
    }

    doGoogleLogin() {
        this.loginSocial('google', this.googleProvider);
    }

    doFacebookLogin() {
        this.loginSocial('facebook', this.facebookProvider);
    }

    loginSocial(typeName, typeLogin) {
        firebase.auth().signInWithPopup(typeLogin).then((result) => {
            let user = {
                name: result.user.displayName,
                email: result.user.email,
                phone: result.user.phoneNumber,
                avatar_url: result.user.photoURL,
                type: typeName,
                roles: { reader: true },
                uid: result.user.uid
            };
            this.af.database.ref('users').child(user.uid).set(user).then((error) => {
                if (!error) {
                    this.userProvider.getUserByKey(user.uid).then(data => {
                        data = data.val();
                        this.storage.set('auth', data).then(data => {
                            this.events.publish('userLoggedIn', data);
                            this.navCtrl.setRoot(TabsPage);
                        });
                    });
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

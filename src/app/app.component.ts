import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalOptions, Modal, ModalController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { UserProvider } from '../providers/user/user';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';
import { PostPage } from '../pages/post/post';
import { UserEditPage } from '../pages/user/user-edit/user-edit';
import { ManagerPostPage } from '../pages/manager-post/manager-post';
import { UpgradePage } from '../pages/upgrade/upgrade';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LoginPage;
    private user: any;
    private activePage: any;

    pages: Array<{ title: string, component: any }>;

    constructor(public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public af: AngularFireDatabase,
        private userProvider: UserProvider,
        private storage: Storage,
        private uniqueDeviceID: UniqueDeviceID,
        public modalCtrl: ModalController,
        private events: Events
    ) {
        this.initializeApp();
        this.storage.get('auth').then((user) => {
            if (user) {
                this.user = user;
                this.authorized(this.user);
            }
        });
        if (!this.user) {
            this.events.subscribe('userLoggedIn', (user) => {
                if (user) {
                    this.user = user;
                    this.authorized(this.user);
                };
            });
        }
    }

    initializeApp() {
        this.platform.ready().then(() => {
            if (this.user) {
                this.uniqueDeviceID.get()
                    .then((uuid: any) => {
                        this.user.pushToken = uuid;
                        this.userProvider.update(this.user).then(data => {
                            console.log(data);
                        })
                    })
                    .catch((error: any) => console.log(error));
            }
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        this.nav.setRoot(page.component);
        this.activePage = page;
    }

    authorized(user) {
        this.rootPage = TabsPage;
        if (user.role == 'admin' || user.role == 'recuiter') {
            this.pages = [
                { title: 'Home', component: TabsPage },
                { title: 'List Favorite Jobs', component: PostPage },
                { title: 'List Applicant', component: UserPage },
                { title: 'Manager Your Post', component: ManagerPostPage },
                { title: 'Upgrade', component: UpgradePage },
            ];
        } else {
            this.pages = [
                { title: 'Home', component: TabsPage },
                { title: 'List Favorite Jobs', component: PostPage },
            ];
        }
    }

    checkActive(p) {
        return p == this.activePage;
    }

    editProfile() {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        let userModal: Modal = this.modalCtrl.create(UserEditPage, { 'user': this.user }, myModalOptions);
        userModal.present();
    }
}

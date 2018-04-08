import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalOptions, Modal, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

import { UserProvider } from '../providers/user/user';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';
import { PostPage } from '../pages/post/post';
import { UserEditPage } from '../pages/user/user-edit/user-edit';
import { ManagerPostPage } from '../pages/manager-post/manager-post';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LoginPage;
    private user: any;

    pages: Array<{ title: string, component: any }>;

    constructor(public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public af: AngularFireDatabase,
        private userProvider: UserProvider,
        private storage: Storage,
        public modalCtrl: ModalController) {
        this.initializeApp();

        this.storage.get('auth').then(user => {
            if (user) {
                this.user = user;
                this.rootPage = TabsPage;
                if (user.role == 'admin' || user.role == 'recuiter') {
                    this.pages = [
                        { title: 'Home', component: TabsPage },
                        { title: 'List Favorite Jobs', component: PostPage },
                        { title: 'List Applicant', component: UserPage },
                        { title: 'Manager Your Post', component: ManagerPostPage }
                    ];
                } else {
                    this.pages = [
                        { title: 'Home', component: TabsPage },
                        { title: 'List Favorite Jobs', component: PostPage },
                        { title: 'List Applicant', component: UserPage },
                    ];
                }
            };
        });

    }

    initializeApp() {
        this.platform.ready().then(() => {

            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        this.nav.setRoot(page.component);
    }

    editProfile() {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };

        let userModal: Modal = this.modalCtrl.create(UserEditPage, { 'user': this.user }, myModalOptions);
        userModal.present();
    }
}

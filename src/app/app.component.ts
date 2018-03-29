import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalOptions, Modal, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireDatabase } from 'angularfire2/database';

import { Storage } from '@ionic/storage';

import { UserProvider } from '../providers/user/user';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ListApplicantPage } from '../pages/list-applicant/list-applicant';
import { ListJobPage } from '../pages/list-job/list-job';
import { UserModalPage } from '../pages/user-modal/user-modal';
import { ManagerPostPage } from '../pages/manager-post/manager-post';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LoginPage;
    public user: any;

    pages: Array<{ title: string, component: any }>;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
        public af: AngularFireDatabase, private storage: Storage, private userProvider: UserProvider,
        public modalCtrl: ModalController) {
        this.initializeApp();

        this.storage.get('auth').then(uid => {
            if (uid) {
                this.rootPage = TabsPage;
                this.userProvider.getUserByKey(uid).then(user => { this.user = user.val(); this.user.id = uid; });
            }
        }).catch(e => console.log(e));

        this.pages = [
            { title: 'Home', component: TabsPage },
            { title: 'List Favorite Jobs', component: ListJobPage },
            { title: 'List Applicant', component: ListApplicantPage },
            { title: 'Manager Your Post', component: ManagerPostPage }
        ];

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

        let userModal: Modal = this.modalCtrl.create(UserModalPage, { 'user': this.user }, myModalOptions);
        userModal.present();
    }
}

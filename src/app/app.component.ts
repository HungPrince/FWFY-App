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

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = TabsPage;
    public user: any;

    pages: Array<{ title: string, component: any }>;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
        public af: AngularFireDatabase, private storage: Storage, private userProvider: UserProvider,
        public modalCtrl: ModalController) {
        this.initializeApp();

        this.storage.get('auth').then(uid => {
            if (!uid) {
                this.rootPage = LoginPage;
                console.log('bbbbb');
            } else {
                console.log(uid);
                this.userProvider.getUserByKey(uid).then(user => { this.user = user.val(); this.user.id = uid; console.log(this.user) });
            }
        }).catch(e => console.log(e));

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: TabsPage },
            { title: 'List Favorite Jobs', component: ListJobPage },
            { title: 'list Applicant', component: ListApplicantPage }
        ];

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
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

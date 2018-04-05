import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { DetailUserPage } from '../../pages/user/detail-user/detail-user';
import { LoaderService } from '../../services/loaderService';

@IonicPage()
@Component({
    selector: 'page-user',
    templateUrl: 'user.html',
})
export class UserPage {

    private listUsers: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public loaderService: LoaderService, public userProvider: UserProvider) {
        this.loaderService.loaderNoSetTime('loading user ..');
        this.userProvider.getAll().subscribe(users => {
            this.listUsers = users;
            this.loaderService.dismisLoader();
        });
    }

    ionViewDidLoad() {

    }

    viewDetail(user) {
        this.navCtrl.push(DetailUserPage, { "user": user });
    }

}

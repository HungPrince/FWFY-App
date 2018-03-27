import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { DetailApplicantPage } from '../../pages/detail-applicant/detail-applicant';
import { LoaderService } from '../../services/loaderService';

@IonicPage()
@Component({
    selector: 'page-list-applicant',
    templateUrl: 'list-applicant.html',
})
export class ListApplicantPage {

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
        this.navCtrl.push(DetailApplicantPage, { "user": user });
    }

}

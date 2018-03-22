import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { DetailApplicantPage } from '../../pages/detail-applicant/detail-applicant';

@IonicPage()
@Component({
    selector: 'page-list-applicant',
    templateUrl: 'list-applicant.html',
})
export class ListApplicantPage {

    private listUsers: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider) {
        this.userProvider.getAll().subscribe(users => { this.listUsers = users; });
    }

    ionViewDidLoad() {

    }

    viewDetail(user) {
        console.log(user);
        this.navCtrl.push(DetailApplicantPage, { "user": user });
    }

}

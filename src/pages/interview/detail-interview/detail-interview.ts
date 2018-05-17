import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-detail-interview',
    templateUrl: 'detail-interview.html',
})
export class DetailInterviewPage {

    private listInvitation: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
        this.listInvitation = this.navParams.get('data');
    }

    goBack() {
        this.viewCtrl.dismiss();
    }

}

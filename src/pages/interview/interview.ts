import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { DetailInterviewPage } from './detail-interview/detail-interview';

import * as _ from 'lodash';

@IonicPage()
@Component({
    selector: 'page-interview',
    templateUrl: 'interview.html',
})
export class InterviewPage {
    private listInterview = [];
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private userProvider: UserProvider,
        private viewCtrl: ViewController,
        private storage: Storage) {
        this.storage.get('auth').then(user => {
            if (user) {
                this.userProvider.getInterview(user.uid).then(data => {
                    _.mapKeys(data.val(), (val, key) => {
                        let arrayInterview = [];
                        _.mapKeys(val, (v, k) => {
                            let isHaved = false;
                            arrayInterview.push(v);
                            for (let i = 0; i < this.listInterview.length; i++) {
                                if (v.uid === this.listInterview[i].recuiter.uid) {
                                    this.listInterview[i];
                                    this.listInterview['invitation'] = arrayInterview;
                                    isHaved = true;
                                    break;
                                }
                            }
                            if (!isHaved) {
                                this.listInterview.push({ recuiter: v, invitation: arrayInterview });
                            }
                        });
                    });
                });
                console.log(this.listInterview);
            }
        });
    }

    openDetail(listInvitation: any) {
        this.navCtrl.push(DetailInterviewPage, { data: listInvitation });
    }

    goBack() {
        this.viewCtrl.dismiss();
    }

}

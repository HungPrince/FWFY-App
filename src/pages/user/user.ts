import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { UserProvider } from '../../providers/user/user';
import { DetailUserPage } from '../../pages/user/detail-user/detail-user';
import { LoaderService } from '../../services/loaderService';

@IonicPage()
@Component({
    selector: 'page-user',
    templateUrl: 'user.html',
})
export class UserPage {

    private listUser: Array<any> = [];
    private userPerPage = 3;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public loaderService: LoaderService, public userProvider: UserProvider, private storage: Storage) {
        this.loaderService.loaderNoSetTime('loading user ..');
        this.userProvider.getUserPagination(this.userPerPage).then(data => {
            for (let key in data.val()) {
                let user = { key: key, val: data.val()[key] }
                this.listUser.push(user);
            }
            this.storage.set("users", this.listUser);
            this.loaderService.dismisLoader();
        });
    }

    ionViewDidLoad() {

    }

    viewDetail(user) {
        this.navCtrl.push(DetailUserPage, { "user": user });
    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            let keyNext = this.listUser[this.listUser.length - 1].key;
            this.userProvider.getUserPaginationNext(keyNext, this.userPerPage).then(data => {
                if (Object.keys(data.val()).length == 1) {
                    infiniteScroll.enable(false);
                }
                for (let key in data.val()) {
                    if (key != keyNext) {
                        let user = { key: key, val: data.val()[key] };
                        this.listUser.push(user);
                    }
                }
            });
            infiniteScroll.complete();
        }, 1000);
    };

}

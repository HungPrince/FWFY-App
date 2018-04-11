import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Content } from 'ionic-angular/components/content/content';

import { UserProvider } from '../../providers/user/user';
import { DetailUserPage } from '../../pages/user/detail-user/detail-user';
import { LoaderService } from '../../services/loaderService';
import { CITIES, SCHOOLS, LEVELS, SPECIALIZEDS, EXPERIENCES, TYPES } from '../../configs/data';

@IonicPage()
@Component({
    selector: 'page-user',
    templateUrl: 'user.html',
})
export class UserPage {

    private listUser: Array<any> = [];
    private textShowHideAdvanced = "Show";
    private searchAdvandced = false;
    private searched = false;
    schools = SCHOOLS;
    levels = LEVELS;
    specializeds = SPECIALIZEDS;
    experiences = EXPERIENCES;
    types = TYPES;
    private listCity = [];
    private listUserSearch = [];
    @ViewChild(Content) content: Content;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public loaderService: LoaderService, public userProvider: UserProvider) {
        this.loaderService.loaderNoSetTime('loading user ..');

        CITIES.forEach(element => {
            for (let key in element) {
                this.listCity.push(element[key]);
            }
        });

        this.userProvider.getAll().subscribe(listUser => {
            listUser = listUser.filter(user => user.role == "applicant");
            this.listUserSearch = listUser;
            this.listUser = listUser;
            this.loaderService.dismisLoader();
        });
    }

    ionViewDidLoad() {

    }

    viewDetail(user) {
        this.navCtrl.push(DetailUserPage, { "user": user });
    }

    showSearchAdvanced() {
        this.content.scrollToTop();
        if (this.searchAdvandced) {
            this.textShowHideAdvanced = "Show";
        } else {
            this.textShowHideAdvanced = "Hide";
        }
        this.searchAdvandced = !this.searchAdvandced;
    }

    getListUser(event) {
        let search = event.target.value ? event.target.value.toLowerCase() : "";
        this.searchUser(search);
    }

    searchUser(search: string) {
        this.searched = true;
        let lstUser = [];
        if (search) {
            lstUser = this.listUserSearch.filter(user => (user.name.toLowerCase().indexOf(search) > -1)
                || user.type == search
                || user.level == search
                || user.school == search
                || user.experience == search
                || user.specialized == search);
        }
        this.listUser = (lstUser.length > 0) ? lstUser : this.listUserSearch;
    }
}

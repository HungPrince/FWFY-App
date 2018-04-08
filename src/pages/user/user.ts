import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Content } from 'ionic-angular/components/content/content';

import { UserProvider } from '../../providers/user/user';
import { DetailUserPage } from '../../pages/user/detail-user/detail-user';
import { LoaderService } from '../../services/loaderService';
import { CITIES, SCHOOLS, LEVELS, SPECIALIZEDS, EXPERIENCES, TYPES } from '../../configs/data';
import { elementDef } from '@angular/core/src/view/element';

@IonicPage()
@Component({
    selector: 'page-user',
    templateUrl: 'user.html',
})
export class UserPage {

    private listUser: Array<any> = [];
    private userPerPage = 3;
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
        public loaderService: LoaderService, public userProvider: UserProvider, private storage: Storage) {
        this.loaderService.loaderNoSetTime('loading user ..');
        this.userProvider.getUserPagination(this.userPerPage).then(data => {
            for (let key in data.val()) {
                let user = data.val()[key];
                user.key = key;
                this.listUser.push(user);
            }
            this.loaderService.dismisLoader();
        });

        CITIES.forEach(element => {
            for (let key in element) {
                this.listCity.push(element[key]);
            }
        });

        this.userProvider.getAll().subscribe(listUser => {
            this.listUserSearch = listUser;
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

    searchByCity(city) {
        this.searchUser(city);
    }

    searchByLevel(level) {
        this.searchUser(level);
    }

    searchByType(type) {
        this.searchUser(type);
    }

    searchBySchool(school) {
        this.searchUser(school);
    }

    searchByExperience(exp) {
        this.searchUser(exp);
    }

    searchBySpecialized(spe) {
        this.searchUser(spe);
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

    doInfinite(infiniteScroll) {
        if (this.searched) {
            infiniteScroll.enable(false);
            return;
        }
        setTimeout(() => {
            let keyNext = this.listUser[this.listUser.length - 1].key;
            this.userProvider.getUserPaginationNext(keyNext, this.userPerPage).then(data => {
                if (Object.keys(data.val()).length == 1) {
                    infiniteScroll.enable(false);
                }
                for (let key in data.val()) {
                    if (key != keyNext) {
                        let user = data.val()[key];
                        user.key = key;
                        this.listUser.push(user);
                    }
                }
            });
            infiniteScroll.complete();
        }, 500);
    };

}

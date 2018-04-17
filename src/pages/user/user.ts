import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ModalOptions } from 'ionic-angular';
import { Content } from 'ionic-angular/components/content/content';
import { Storage } from '@ionic/storage';

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
    private userCurrent: any;
    private listUser: Array<any> = [];
    private textShowHideAdvanced = "Show";
    private searchAdvandced = false;
    private searched = false;
    private nameIconHeart = 'heart-outline';
    schools = SCHOOLS;
    levels = LEVELS;
    specializeds = SPECIALIZEDS;
    experiences = EXPERIENCES;
    types = TYPES;
    private listCity = [];
    private listUserSearch = [];
    @ViewChild(Content) content: Content;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public loaderService: LoaderService,
        public userProvider: UserProvider,
        private storage: Storage,
        private modalCtrl: ModalController) {
        this.loaderService.loaderNoSetTime('loading user ..');

        this.storage.get('auth').then(user => {
            this.userCurrent = user;
        });

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

    viewDetail(user) {
        let modalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let modalDetailUser = this.modalCtrl.create(DetailUserPage, {"user": user}, modalOptions);
        modalDetailUser.present();
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

    saveUser(key: string) {
        if (!this.userCurrent.saveUserFav) {
            this.userCurrent.saveUserFav = {};
        }
        this.userCurrent.saveUserFav[key] = this.userCurrent.saveUserFav[key] ? null : true;
        this.userProvider.update(this.userCurrent).then(error => {
            if (!error) {
                this.storage.set('auth', this.userCurrent);
                console.log('Save user successfully!');
            } else {
                console.log(error);
            }
        });
    }

    getNameIconHeart(key: string) {
        return (this.userCurrent.saveUserFav && this.userCurrent.saveUserFav[key]) ? 'heart' : 'heart-outline';
    }

    getUserFav() {
        this.nameIconHeart = this.nameIconHeart === 'heart' ? 'heart-outline' : 'heart';
        if (this.nameIconHeart === 'heart') {
            this.listUser = this.listUser.filter(user => this.userCurrent.saveUserFav && this.userCurrent.saveUserFav[user.uid]);
        } else {
            this.listUser = this.listUserSearch;
        }
    }
}

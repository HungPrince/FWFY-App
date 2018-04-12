import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';

import { UPGRADE } from '../../configs/data';
import { ToastService } from '../../services/toastService';
import { LoaderService } from '../../services/loaderService';

@IonicPage()
@Component({
    selector: 'page-upgrade',
    templateUrl: 'upgrade.html',
})
export class UpgradePage {
    @ViewChild(Slides) slides: Slides;
    upgrades = UPGRADE;
    user: any;
    private typeAccount;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private userProvider: UserProvider,
        private storage: Storage,
        private loadingService: LoaderService,
        private toastService: ToastService
    ) {
        this.storage.get('auth').then(user => {
            this.user = user;
        });
    }

    goToSlide() {
        this.slides.slideTo(2, 500);
    }

    slideChanged() {
        let currentIndex = this.slides.getActiveIndex();
        switch (currentIndex) {
            case 1: {
                this.typeAccount = "standard";
                break;
            }
            case 2: {
                this.typeAccount = 'enterprise';
                break;
            }
            default: this.typeAccount = 'free';
        }
    };

    upgradeAccount() {
        console.log('test');
        this.loadingService.loaderNoSetTime('Upgrade account ...');
        this.user.typeAccount = this.typeAccount;
        this.userProvider.update(this.user).then(error => {
            if (!error) {
                this.loadingService.dismisLoader().then(data => {
                    this.toastService.toast('You were upgraded successfully!', 1000, 'middle', false);
                    this.storage.set('auth', this.user);
                }).catch(error => console.log(error));
            }
        });
    }
}

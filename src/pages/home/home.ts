import { Component } from '@angular/core';
import { NavController, MenuController, ModalOptions, Modal, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { JobProvider } from '../../providers/job/job';
import { LoginPage } from '../login/login';
import { ModalAddJobPage } from '../modal-add-job/modal-add-job';

import { LoaderService } from '../../services/loaderService';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private listJob: Array<any>;
    public user: any;
    constructor(public navCtrl: NavController, public storage: Storage, public menuCtrl: MenuController,
        public jobProvider: JobProvider, public loaderService: LoaderService, public modalCtrl: ModalController) {

        this.loaderService.loaderNoSetTime('loading ...');

        this.jobProvider.getAll().subscribe((jobs) => {
            this.loaderService.dismisLoader();
            this.listJob = jobs;
        });

    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

    public logout() {
        this.storage.set('auth', null);
        this.navCtrl.push(LoginPage);
    }

    openModalAdd() {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModal: Modal = this.modalCtrl.create(ModalAddJobPage, myModalOptions);
        myModal.present();
    }

    public getUserByKey(key) {
        this.jobProvider.getUserByKey(key).subscribe(data => {
            if (data) {
                this.user = data;
                console.log(data);
                return true;
            }
            return false;
        });
    }

    closeModal() {
        return true;
    }

}

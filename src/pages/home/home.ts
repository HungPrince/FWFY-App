import { Component } from '@angular/core';
import { NavController, MenuController, ModalOptions, Modal, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { JobProvider } from '../../providers/job/job';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
import { ModalAddJobPage } from '../modal-add-job/modal-add-job';

import { LoaderService } from '../../services/loaderService';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public listJob: Array<any> = [];
    public user: any;
    constructor(public navCtrl: NavController, public storage: Storage, public menuCtrl: MenuController, public modalCtrl: ModalController,
        public jobProvider: JobProvider, public loaderService: LoaderService, private userProvider: UserProvider) {

        this.loaderService.loaderNoSetTime('loading ...');
        this.jobProvider.getAll().subscribe((jobs) => {
            jobs.forEach(job => {
                this.userProvider.getUserByKey(job.userId).then(data => {
                    this.listJob.push({
                        job: job,
                        user: {
                            avatar_url: data.val()['avatar_url'],
                            name: data.val()['name'],
                            age: data.val()['age'],
                            gender: data.val()['gender'] ? "male" : "female"
                        }
                    });
                });
            }, (error) => {
                this.loaderService.dismisLoader();
            });
            this.loaderService.dismisLoader();
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

    closeModal() {
        return true;
    }

}

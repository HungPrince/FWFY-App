import { Component } from '@angular/core';
import { NavController, MenuController, ModalOptions, Modal, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

import { JobProvider } from '../../providers/job/job';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
import { ModalAddJobPage } from '../modal-add-job/modal-add-job';

import { LoaderService } from '../../services/loaderService';

@Component({
    selector: 'page-list-job',
    templateUrl: 'list-job.html'
})
export class ListJobPage {
    public listJob: Array<any> = [];
    public user: any;
    private userCurrent: any;
    constructor(public navCtrl: NavController, public storage: Storage, public menuCtrl: MenuController, public modalCtrl: ModalController,
        public jobProvider: JobProvider, public loaderService: LoaderService, private userProvider: UserProvider,
        private socialSharing: SocialSharing) {

        this.loaderService.loaderNoSetTime('loading ...');

        this.storage.get('auth').then(uid => {
            this.userProvider.getUserByKey(uid).then(data => {
                this.userCurrent = data.val();
                this.userCurrent.uid = uid;
                this.jobProvider.getAll().subscribe((jobs) => {
                    jobs = jobs.filter(job => job.userId == this.userCurrent.uid && this.userCurrent.likes[job.key]);
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
            });
        }).catch(error => { this.loaderService.dismisLoader(); console.log(error) });
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

    share() {
        this.socialSharing.canShareVia(
            "Findwork for you",
            "Setting app to have many job for you",
            "Powergate company need 3 developer Node js",
            "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/15823472_1903496763215059_2160427870381018848_n.jpg?_nc_cat=0&oh=d6c75182f5c8cafe4dab2b2573559957&oe=5B48053D",
            "Powergatesoftware.com").
            then(data => console.log(data)).catch(error => console.log(error));
    }

    public saveJob(jobId: string) {
        this.userCurrent.likes[jobId] = (this.userCurrent.likes && this.userCurrent.likes[jobId]) ? false : true;
        this.userProvider.update(this.userCurrent).then(error => console.log(error));
    }

}


import { Component } from '@angular/core';
import { NavController, MenuController, ModalOptions, Modal, ModalController, ActionSheetController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

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
    private userCurrent: any;
    constructor(public navCtrl: NavController, public storage: Storage, public menuCtrl: MenuController, public modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController,
        public jobProvider: JobProvider, public loaderService: LoaderService, private userProvider: UserProvider,
        private socialSharing: SocialSharing) {

        this.loaderService.loaderNoSetTime('loading ...');

        this.storage.get('auth').then(uid => {
            if (uid) {
                this.userProvider.getUserByKey(uid).then(data => {
                    this.userCurrent = data.val();
                    this.userCurrent.uid = uid;
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
                });
            } else {
                this.loaderService.dismisLoader();
                this.navCtrl.setRoot(LoginPage);
            }
        }).catch(error => { console.log(error); this.loaderService.dismisLoader() });


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

    shareJob(job) {
        let sharePostActionSheet = this.actionSheetCtrl.create({
            title: "Share this job",
            buttons: [
                {
                    text: "Share on Facebook",
                    icon: "logo-facebook",
                    handler: () => {
                        this.socialSharing.shareViaFacebook(
                            job.description,
                            "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/15823472_1903496763215059_2160427870381018848_n.jpg?_nc_cat=0&oh=d6c75182f5c8cafe4dab2b2573559957&oe=5B48053D",
                            job.website
                        )
                    }
                },
                {
                    text: "Twitter",
                    icon: "logo-twitter",
                    handler: () => {
                        this.socialSharing.shareViaTwitter(
                            job.description,
                            "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/15823472_1903496763215059_2160427870381018848_n.jpg?_nc_cat=0&oh=d6c75182f5c8cafe4dab2b2573559957&oe=5B48053D",
                            job.website
                        )
                    }
                },
                {
                    text: "Share",
                    icon: "share",
                    handler: () => {
                        this.socialSharing.canShareVia(
                            "Findwork for you",
                            "Setting app to have many job for you",
                            "Powergate company need 3 developer Node js",
                            "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/15823472_1903496763215059_2160427870381018848_n.jpg?_nc_cat=0&oh=d6c75182f5c8cafe4dab2b2573559957&oe=5B48053D",
                            "Powergatesoftware.com").
                            then(data => console.log(data)).catch(error => console.log(error));
                    }
                },
                {
                    text: "Cancel",
                    role: "destructive"
                }
            ]
        })
        sharePostActionSheet.present();
    }

    public saveJob(jobId: string) {
        if (!this.userCurrent.saves) {
            this.userCurrent.saves = {};
        }
        this.userCurrent.saves[jobId] = (this.userCurrent.saves && this.userCurrent.saves[jobId]) ? false : true;
        this.userProvider.update(this.userCurrent).then(error => console.log(error));
    }

    public countLikes(likes) {
        if (!likes) {
            return "like";
        } else {
            let likesNumber = Object.keys(likes).length;
            return likesNumber == 1 ? likesNumber + " like" : likesNumber + " likes";
        }
    }

    public likeJob(job: any) {
        let key = job.key;
        if (!this.userCurrent.likes) {
            this.userCurrent.likes = {};
        }
        this.userCurrent.likes[key] = (this.userCurrent.likes && this.userCurrent.likes[key]) ? false : true;
        this.userProvider.update(this.userCurrent).then(error => {
            if (!error) {
                let userId = this.userCurrent.uid;
                if (!job.likes) {
                    job.likes = {};
                }
                job.likes[userId] = (job.likes && job.likes[userId]) ? null : userId;
                this.jobProvider.update(job);
            }
        });

    }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { JobProvider } from '../../providers/job/job';
import { LoaderService } from '../../services/loaderService';

@IonicPage()
@Component({
    selector: 'page-manager-post',
    templateUrl: 'manager-post.html',
})
export class ManagerPostPage {

    public listJob: Array<any> = [];
    items = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private loaderService: LoaderService, private storage: Storage, private jobProvider: JobProvider) {
        this.loaderService.loaderNoSetTime('loading ...');

        for (let i = 0; i < 30; i++) {
            this.items.push(this.items.length);
        }

        this.storage.get('auth').then(uid => {
            this.jobProvider.getAll().subscribe((jobs) => {
                jobs.forEach(job => {
                    if (job.userId == uid.toString()) {
                        this.listJob.push(job);
                    }
                }, (error) => {
                    this.loaderService.dismisLoader();
                });
                this.loaderService.dismisLoader();
            });
        }).catch(error => { console.log(error); this.loaderService.dismisLoader() });
    }

    ionViewDidLoad() {
    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            for (let i = 0; i < 30; i++) {
                console.log(this.items);
                this.items.push(this.items.length);
            }
            infiniteScroll.complete();
        }, 500);
    }
}

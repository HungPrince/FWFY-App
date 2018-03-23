import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Validators, FormControl, FormBuilder } from '@angular/forms';

import { UntilHelper } from '../../helpers/until.helper';
import { JobProvider } from '../../providers/job/job';
import { LoaderService } from '../../services/loaderService';
import { ToastService } from '../../services/toastService';

@IonicPage()
@Component({
    selector: 'page-modal-add-job',
    templateUrl: 'modal-add-job.html',
})
export class ModalAddJobPage {

    private formAddJob: any;
    public logoUrl;
    private job: { [x: string]: any } = {};

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
        public formBuilder: FormBuilder, private storage: Storage, private untilHelper: UntilHelper, private jobProvider: JobProvider,
        public loaderService: LoaderService, public toastService: ToastService) {
        this.storage.get('auth').then(uid => {
            this.job.userId = uid;
        })
        this.logoUrl = "https://placehold.it/150x150";
        this.job.userId =

            this.formAddJob = this.formBuilder.group({
                'company': new FormControl('', [Validators.required]),
                'title': new FormControl('', Validators.compose([Validators.required])),
                'location': new FormControl('', Validators.required),
                'function': new FormControl('', Validators.required),
                'type': new FormControl('', Validators.required),
                'level': new FormControl('', Validators.required),
                'website': new FormControl(),
                'dateFrom': new FormControl(new Date(), Validators.required),
                'dateTo': new FormControl('', Validators.required),
                'description': new FormControl('', Validators.required),
            });
    }

    ionViewDidLoad() {

    }

    goBack() {
        this.viewCtrl.dismiss();
    }

    save() {
        this.loaderService.loaderNoSetTime('save ...');
        this.job.company = this.untilHelper.niceString(this.formAddJob.value.company);
        this.job.title = this.untilHelper.niceString(this.formAddJob.value.title);
        this.job.location = this.untilHelper.niceString(this.formAddJob.value.location);
        this.job.function = this.formAddJob.value.function;
        this.job.level = this.formAddJob.value.level;
        this.job.type = this.formAddJob.value.type;
        this.job.website = this.untilHelper.niceString(this.formAddJob.value.website);
        this.job.dateFrom = this.formAddJob.value.dateFrom;
        this.job.dateTo = this.formAddJob.value.dateTo;
        this.job.description = this.formAddJob.value.description;
        this.job.createdAt = Date.now;
        this.jobProvider.add(this.job).then(data => {
            this.loaderService.dismisLoader().then(data => {
                this.goBack();
                this.toastService.toast('Create post successfully', 1000, 'bottom', false);
            })
            console.log(data);
        })
    }


}

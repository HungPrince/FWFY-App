import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-modal-add-job',
    templateUrl: 'modal-add-job.html',
})
export class ModalAddJobPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    }

    ionViewDidLoad() {

    }

    goBack() {
        this.viewCtrl.dismiss();
    }

    save(){
        
    }

}

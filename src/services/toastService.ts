import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class ToastService {
    toastService: any;
    constructor(public toastCtrl: ToastController) {

    }

    public toastNoSetTime(message, position) {
        this.toastService = this.toastCtrl.create({
            message: message,
            position: position
        });

        this.toastService.present();
    }


    public toast(message, duration, position, showCloseButton) {
        this.toastService = this.toastCtrl.create({
            message: message,
            duration: duration,
            position: position,
            showCloseButton: showCloseButton
        });

        this.toastService.present();
    }

    public dismisToast() {
        this.toastService.dismiss();
    }
}

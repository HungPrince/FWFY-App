import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {
    loadService: any;
    constructor(public loadingCtr: LoadingController) {

    }

    public loaderNoSetTime(content) {
        if (this.loadService) {
            this.loadService = null;
        }

        this.loadService = this.loadingCtr.create({
            content: content,
            dismissOnPageChange: false
        });
        this.loadService.present();
    }

    public loader(content, time) {
        if (this.loadService) {
            this.loadService = null;
        }

        this.loadService = this.loadingCtr.create({
            content: content,
            duration: time,
            dismissOnPageChange: false
        });
        this.loadService.present();
    }

    public dismisLoader(): any {
        if (this.loadService) {
            try {
                return this.loadService.dismiss();
            } catch (err) {
                console.log(err);
            }
        }
    }
}

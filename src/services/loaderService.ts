import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {
    loadService: any;
    constructor(public loadingCtr: LoadingController) {
    }

    public loaderNoSetTime(content) {
        if (this.loadService) {
            this.loadService.dismiss();
        }
        this.loadService = this.loadingCtr.create({
            content: content,
        });
        this.loadService.present();
    }

    public loader(content, time) {
        if (this.loadService) {
            this.loadService.dismiss();
        }
        this.loadService = this.loadingCtr.create({
            content: content,
            duration: time
        });
        this.loadService.present();
    }

    public dismisLoader(): any {
        if (this.loadService) {
            return this.loadService.dismiss();
        }
    }
}

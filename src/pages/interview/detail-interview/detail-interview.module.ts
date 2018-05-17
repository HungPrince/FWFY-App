import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailInterviewPage } from './detail-interview';

@NgModule({
    declarations: [
        DetailInterviewPage,
    ],
    imports: [
        IonicPageModule.forChild(DetailInterviewPage),
    ],
})
export class DetailInterviewPageModule { }

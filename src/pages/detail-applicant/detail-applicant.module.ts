import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailApplicantPage } from './detail-applicant';

@NgModule({
    declarations: [
        DetailApplicantPage,
    ],
    imports: [
        IonicPageModule.forChild(DetailApplicantPage),
    ],
})
export class DetailApplicantPageModule { }

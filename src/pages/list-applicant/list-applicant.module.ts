import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListApplicantPage } from './list-applicant';

@NgModule({
  declarations: [
    ListApplicantPage,
  ],
  imports: [
    IonicPageModule.forChild(ListApplicantPage),
  ],
})
export class ListApplicantPageModule {}

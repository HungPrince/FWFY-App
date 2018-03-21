import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListJobPage } from './list-job';

@NgModule({
  declarations: [
    ListJobPage,
  ],
  imports: [
    IonicPageModule.forChild(ListJobPage),
  ],
})
export class ListJobPageModule {}

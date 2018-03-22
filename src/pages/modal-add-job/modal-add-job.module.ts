import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddJobPage } from './modal-add-job';

@NgModule({
  declarations: [
    ModalAddJobPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddJobPage),
  ],
})
export class ModalAddJobPageModule {}

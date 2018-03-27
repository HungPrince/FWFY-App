import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagerPostPage } from './manager-post';

@NgModule({
  declarations: [
    ManagerPostPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagerPostPage),
  ],
})
export class ManagerPostPageModule {}

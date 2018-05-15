import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalOptions, ModalController, Modal, ViewController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';

@IonicPage()
@Component({
    selector: 'page-user-chat',
    templateUrl: 'user-chat.html',
})
export class UserChatPage {
    users: any;
    constructor(public navCtrl: NavController,
         public navParams: NavParams, 
         public viewCtrl: ViewController,
         private modalCtrl: ModalController) {
        this.users = this.navParams.get('users');
    }

    goBack() {
        this.viewCtrl.dismiss();
    }

    openChat(userChat: any) {
        this.openModal(ChatPage, { 'chatUser': userChat });
    }

    openModal(pageName, data) {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModal: Modal = this.modalCtrl.create(pageName, data, myModalOptions);
        myModal.present();
    }

}

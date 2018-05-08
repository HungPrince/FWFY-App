import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { UntilHelper } from '../../helpers/until.helper';

@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {

    chat: any;
    chats: any = [];
    textMessage: string;
    constructor(
        private viewCtrl: ViewController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private chatProvider: ChatProvider,
        private untilHelper: UntilHelper) {
        this.chat = this.navParams.get('chatUser');
    }

    ionViewDidLoad() {
        this.chatProvider.getListChat(this.chat.keyChat, this.chat.postId).subscribe(data => {
            this.chats = data;
        });
    }

    closeModal() {
        this.viewCtrl.dismiss();
    }

    pushChat() {
        this.textMessage = this.untilHelper.niceString(this.textMessage);
        if (this.textMessage) {
            let msg = {
                user: this.chat.userCurrent,
                message: this.textMessage,
                createdAt: Date.now()
            };
            this.chatProvider.pushChat(this.chat.keyChat, this.chat.postId, msg).then(data => {
                if (data.key) {
                    this.textMessage = "";
                    console.log('Your message were send successfully!');
                }
            });
        }
    }
}

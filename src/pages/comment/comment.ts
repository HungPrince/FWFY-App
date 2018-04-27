import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { UntilHelper } from '../../helpers/until.helper';

@IonicPage()
@Component({
    selector: 'page-comment',
    templateUrl: 'comment.html',
})
export class CommentPage {
    comment: any;
    comments: any = [];
    textMessage: string;
    private uidUser: string;
    constructor(
        private viewCtrl: ViewController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private chatProvider: ChatProvider,
        private untilHelper: UntilHelper) {
        this.comment = this.navParams.get('message');
        this.uidUser = this.comment.user.uid;
    }

    ionViewDidLoad() {
        this.chatProvider.getListChat(this.comment.key).subscribe(data => {
            this.comments = data;
        });
    }

    goBack() {
        this.viewCtrl.dismiss();
    }

    pushChat() {
        this.textMessage = this.untilHelper.niceString(this.textMessage);
        if (this.textMessage) {
            let msg = {
                uid: this.comment.user.uid,
                username: this.comment.user.name,
                message: this.textMessage,
                avatar_url: this.comment.user.avatar_url,
                createdAt: Date.now()
            };
            this.chatProvider.pushChat(this.comment.key, msg).then(data => {
                if (data.key) {
                    this.comments.push(msg);
                    this.textMessage = "";
                    console.log('Your message were send successfully!');
                }
            });
        }
    }

}

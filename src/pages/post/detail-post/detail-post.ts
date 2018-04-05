import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalOptions, ModalController } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { Storage } from '@ionic/storage';

import { PostProvider } from '../../../providers/post/post';
import { ToastService } from "../../../services/toastService";
import { PostAddPage } from '../post-add/post-add';
import { ViewController } from 'ionic-angular/navigation/view-controller';

@IonicPage()
@Component({
    selector: 'page-detail-post',
    templateUrl: 'detail-post.html',
})
export class DetailPostPage {

    selectedFiles: FileList;
    file: File;
    post: any;
    user: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private storageFB: AngularFireStorage,
        private storage: Storage,
        private postProvider: PostProvider,
        private toastService: ToastService,
        private modalCtrl: ModalController,
        private viewCtrl: ViewController) {
        this.post = navParams.get('post');
        this.storage.get('auth').then(uid => {
            this.user.uid = uid;
        });
    }

    ionViewDidLoad() {

    }

    goBack() {
        this.viewCtrl.dismiss();
    }

    edit() {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModal: Modal = this.modalCtrl.create(PostAddPage, { 'post': this.post }, myModalOptions);
        myModal.present();
    }

    chooseFiles(event) {
        this.selectedFiles = event.target.files;
        if (this.selectedFiles.item(0)) {
            this.uploadFile();
        }
    }

    uploadFile() {
        if (!this.post.files) {
            this.post.files = [];
        }
        let file = this.selectedFiles.item(0);
        let uniqkey = 'file' + Math.floor(Math.random() * 1000000);
        this.storageFB.upload('/files/' + uniqkey, file).then((uploadTask) => {
            this.post.files[this.user.uid] = uploadTask.downloadURL;
            this.postProvider.update(this.post).then(error => {
                if (!error) {
                    this.toastService.toast("Apply successfully!", 1000, "bottom", false);
                } else {
                    this.toastService.toast("Something went wrong!", 1000, "bottom", false);
                }
            });
        });
    }
}

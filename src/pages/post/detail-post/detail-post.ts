import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalOptions, ModalController } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { Storage } from '@ionic/storage';

import { PostProvider } from '../../../providers/post/post';
import { UserProvider } from '../../../providers/user/user';
import { ToastService } from "../../../services/toastService";
import { LoaderService } from "../../../services//loaderService";
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
        private userProvider: UserProvider,
        private toastService: ToastService,
        private modalCtrl: ModalController,
        private viewCtrl: ViewController,
        private loaderService: LoaderService) {
        this.post = navParams.get('post');
        this.storage.get('auth').then(user => {
            this.userProvider.getUserByKey(user.uid).then(data => {
                this.user = data.val();
            });
        });
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
        if (!this.user.file) {
            this.user.file = "";
        }
        if (!this.post.files) {
            this.post.files = [];
        }
        this.loaderService.loaderNoSetTime('applying...');
        let file = this.selectedFiles.item(0);
        let uniqkey = 'cv_' + this.user.name + '_' + Math.floor(Math.random() * 1000000);
        this.storageFB.upload('/files/' + uniqkey, file).then((uploadTask) => {
            this.user.file = uploadTask.downloadURL;
            this.post.files[this.user.uid] = uploadTask.downloadURL;
            this.userProvider.update(this.user).then(error => {
                if (!error) {
                    this.postProvider.update(this.post).then(error => {
                        if (!error) {
                            this.loaderService.dismisLoader().then(data => {
                                this.goBack();
                                this.toastService.toast("Apply successfully!", 1000, "bottom", false);
                            }).catch(error => console.log(error));
                        } else {
                            this.user.file = "";
                            this.userProvider.update(this.user).then(data => {
                            });
                            this.showError(null);
                        }
                    }).catch(error => this.showError(error));
                } else {
                    this.showError(null);
                }
            }).catch(error => this.showError(error));
        });
    }

    showError(error) {
        console.log(error);
        this.loaderService.dismisLoader().then(data => {
            this.toastService.toast("Something went wrong!", 1000, "bottom", false);
        }).catch(error => console.log(error));
    }
}

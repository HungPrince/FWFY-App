import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalOptions, ModalController } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { Storage } from '@ionic/storage';

import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

import { PostProvider } from '../../../providers/post/post';
import { UserProvider } from '../../../providers/user/user';
import { ToastService } from "../../../services/toastService";
import { LoaderService } from "../../../services//loaderService";
import { PostAddPage } from '../post-add/post-add';
import { ViewController } from 'ionic-angular/navigation/view-controller';

declare var window;

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
        private loaderService: LoaderService,
        private fileChoose: FileChooser,
        private fileTransfer: FileTransfer,
        private filePath: FilePath) {
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

    // chooseFiles(event) {
    //     this.selectedFiles = event.target.files;
    //     if (this.selectedFiles.item(0)) {
    //         this.uploadFile();
    //     }
    // }

    uploadFile() {
        if (!this.user.file) {
            this.user.file = "";
        }
        if (!this.post.files) {
            this.post.files = [];
        }

        this.loaderService.loaderNoSetTime('applying...');

        let file;

        this.fileChoose.open().then(uri => {
            this.filePath.resolveNativePath(uri).then(fileentry => {
                let filename = this.getfilename(fileentry);
                let fileext = this.getfileext(fileentry);
                this.makeFileIntoBlob(fileentry, fileext, "application/pdf").then((fileblob) => {
                    file = {
                        blob: fileblob,
                        type: "application/pdf",
                        fileext: fileext,
                        filename: filename
                    }
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
                    }).catch(error => this.showError(error));
                });
            }).catch(err => console.log(err));
        }).catch(error => this.showError(error))

        // let file = this.selectedFiles.item(0);
        // console.log(file);

    }

    showError(error) {
        console.log(error);
        this.loaderService.dismisLoader().then(data => {
            this.toastService.toast("Something went wrong!", 1000, "bottom", false);
        }).catch(error => console.log(error));
    }

    makeFileIntoBlob(_imagePath, name, type) {
        // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

                fileEntry.file((resFile) => {

                    var reader = new FileReader();
                    reader.onloadend = (evt: any) => {
                        var imgBlob: any = new Blob([evt.target.result], { type: type });
                        imgBlob.name = name;
                        resolve(imgBlob);
                    };

                    reader.onerror = (e) => {
                        alert('Failed file read: ' + e.toString());
                        reject(e);
                    };

                    reader.readAsArrayBuffer(resFile);
                });
            });
        });
    }

    getfilename(filestring) {

        let file
        file = filestring.replace(/^.*[\\\/]/, '')
        return file;
    }

    getfileext(filestring) {
        let file = filestring.substr(filestring.lastIndexOf('.') + 1);
        return file;
    }
}
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalOptions, ModalController, ActionSheetController } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { Storage } from '@ionic/storage';
import { ViewController } from 'ionic-angular/navigation/view-controller';

import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';

import { PostProvider } from '../../../providers/post/post';
import { UserProvider } from '../../../providers/user/user';
import { ToastService } from "../../../services/toastService";
import { LoaderService } from "../../../services//loaderService";
import { PostAddPage } from '../post-add/post-add';
import { CvPage } from '../../cv/cv';

declare var window;

@IonicPage()
@Component({
    selector: 'page-detail-post',
    templateUrl: 'detail-post.html',
})
export class DetailPostPage {

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
        private filePath: FilePath,
        private actionSheetCtrl: ActionSheetController) {
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

    chooseApply() {
        let actionSheetCtrl = this.actionSheetCtrl.create({
            title: 'Please choose your method want to apply.',
            buttons:
                [
                    {
                        text: 'Create cv',
                        handler: () => {
                            this.navCtrl.push(CvPage);
                        }
                    },
                    {
                        text: 'Upload file',
                        handler: () => {
                            this.uploadFile();
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Clicked cancel');
                        }
                    }
                ]
        });
        actionSheetCtrl.present();
    }

    uploadFile() {
        if (!this.user.file) {
            this.user.file = "";
        }
        if (!this.post.files) {
            this.post.files = {};
        }

        let file;
        let typeFile;

        this.fileChoose.open().then(uri => {
            this.loaderService.loaderNoSetTime('applying...');
            this.filePath.resolveNativePath(uri).then(fileentry => {
                let filename = this.getfilename(fileentry);
                let fileext = this.getfileext(fileentry);
                if (fileext.length < 5 && fileext != "doc" && fileext != "pdf" && fileext != "docx") {
                    this.loaderService.dismisLoader().then(data => {
                        this.toastService.toast("File is incorrect extension!", 1000, "bottom", false);
                        return;
                    }).catch(error => console.log(error));
                } else {
                    if (fileext == "doc") {
                        typeFile = "application/msword";
                    } else if (fileext == "docx") {
                        typeFile = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    } else {
                        typeFile = "application/pdf";
                        fileext = "pdf";
                    }
                    this.makeFileIntoBlob(fileentry, fileext, typeFile).then((fileblob) => {
                        file = {
                            blob: fileblob,
                            type: typeFile,
                            fileext: fileext,
                            filename: filename
                        }
                        let uniqkey = 'cv_' + this.user.name + '_' + Math.floor(Math.random() * 1000000);
                        this.storageFB.upload('/files/' + uniqkey, file.blob).then((uploadTask) => {
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
                }
            }).catch(err => console.log(err));
        }).catch(error => this.showError(error))
    }

    makeFileIntoBlob(_filePath, name, type) {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(_filePath, (fileEntry) => {

                fileEntry.file((resFile) => {

                    let reader = new FileReader();
                    reader.onloadend = (evt: any) => {
                        let fileBlob: any = new Blob([evt.target.result], { type: type });
                        fileBlob.name = name;
                        resolve(fileBlob);
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
        file = filestring.replace(/^.*[\\\/]/, '');
        return file;
    }

    getfileext(filestring) {
        let file = filestring.substr(filestring.lastIndexOf('.') + 1);
        return file;
    }

    showError(error) {
        console.log(error);
        this.loaderService.dismisLoader().then(data => {
            this.toastService.toast("Something went wrong!", 1000, "bottom", false);
        }).catch(error => console.log(error));
    }
}
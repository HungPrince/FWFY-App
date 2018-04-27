import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalOptions, Modal, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { PostAddPage } from '../post/post-add/post-add';
import { PostProvider } from '../../providers/post/post';
import { LoaderService } from '../../services/loaderService';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
    selector: 'page-manager-post',
    templateUrl: 'manager-post.html',
})

export class ManagerPostPage {
    messageNotFound = "You have not post";
    public listPost: Array<any> = [];
    private listUser: Array<any> = [];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private loaderService: LoaderService,
        private storage: Storage,
        private postProvider: PostProvider,
        private modalCtrl: ModalController,
        private userProvider: UserProvider) {
        this.loaderService.loaderNoSetTime('loading ...');

        this.userProvider.getAll().subscribe(users => {
            this.listUser = users;
        });

        this.storage.get('auth').then(user => {
            this.postProvider.getAll().subscribe((posts) => {
                posts.forEach(post => {
                    let listCv: Array<any> = [];
                    if (post.userId == user.uid.toString()) {
                        if (post.files) {
                            for (let key in post.files) {
                                this.userProvider.getUserByKey(key).then(user => {
                                    listCv.push({
                                        user: user.val(),
                                        linkCv: post.files[key]
                                    });
                                });
                            }
                        }
                        this.listPost.push({
                            post: post,
                            listCv: listCv,
                            user: user
                        });
                    }
                }, (error) => {
                    this.loaderService.dismisLoader();
                });
                this.loaderService.dismisLoader();
            }, error => { console.log(error); this.loaderService.dismisLoader(); });
        }).catch(error => { console.log(error); this.loaderService.dismisLoader() });
    }

    openModalAdd() {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModal: Modal = this.modalCtrl.create(PostAddPage, myModalOptions);
        myModal.present();
    }
}

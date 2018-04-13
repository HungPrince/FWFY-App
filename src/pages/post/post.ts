import { Component } from '@angular/core';
import { NavController, ModalOptions, Modal, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';

import { LoaderService } from '../../services/loaderService';
import { PostAddPage } from './post-add/post-add';

@Component({
    selector: 'page-post',
    templateUrl: 'post.html'
})
export class PostPage {
    public listPost: Array<any> = [];
    messageNotFound = "You have not Job favorite";
    constructor(public navCtrl: NavController,
        public storage: Storage,
        public loaderService: LoaderService,
        private modalCtrl: ModalController
    ) {
        this.loaderService.loaderNoSetTime('loading ...');
        
        this.storage.get('posts').then(posts => {
            if (posts) {
                this.storage.get('auth').then(user => {
                    this.listPost = posts.filter(post => user.saves[post.post.key]);
                    this.loaderService.dismisLoader();
                });
            } else {
                this.loaderService.dismisLoader();
            }
        });
    }

    openModalAdd() {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModal: Modal = this.modalCtrl.create(PostAddPage, myModalOptions);
        myModal.present();
    }

    public logout() {
        this.storage.set('auth', null);
        this.navCtrl.push(LoginPage);
    }
}


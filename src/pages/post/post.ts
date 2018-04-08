import { Component } from '@angular/core';
import { NavController, MenuController, ModalOptions, Modal, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

import { PostProvider } from '../../providers/post/post';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
import { PostAddPage } from '../post/post-add/post-add';

import { LoaderService } from '../../services/loaderService';

@Component({
    selector: 'page-post',
    templateUrl: 'post.html'
})
export class PostPage {
    public listPost: Array<any> = [];
    public user: any;
    private userCurrent: any;
    messageNotFound = "You have not Job favorite";
    constructor(public navCtrl: NavController, public storage: Storage, public menuCtrl: MenuController, public modalCtrl: ModalController,
        public postProvider: PostProvider, public loaderService: LoaderService, private userProvider: UserProvider,
        private socialSharing: SocialSharing) {

        this.loaderService.loaderNoSetTime('loading ...');

        this.storage.get('auth').then(user => {
            this.userProvider.getUserByKey(user.uid).then(data => {
                this.userCurrent = data.val();
                this.userCurrent.uid = user.uid;
                this.postProvider.getAll().subscribe(posts => {
                    if (posts) {
                        posts = posts.filter(post => this.userCurrent.saves && this.userCurrent.saves[post.key]);
                        if (posts) {
                            posts.forEach(post => {
                                this.userProvider.getUserByKey(post.userId).then(data => {
                                    this.listPost.push({
                                        post: post,
                                        user: {
                                            avatar_url: data.val()['avatar_url'],
                                            name: data.val()['name'],
                                            age: data.val()['age'],
                                            gender: data.val()['gender'] ? "male" : "female"
                                        }
                                    });
                                }).catch(error => { console.log(error); this.loaderService.dismisLoader(); });
                            });
                        };
                        this.loaderService.dismisLoader();
                    } else {
                        this.loaderService.dismisLoader();
                    }
                }, error => { this.loaderService.dismisLoader(); });
            }).catch(error => { this.loaderService.dismisLoader(); console.log(error) });
        }).catch(error => { this.loaderService.dismisLoader(); console.log(error) });
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

    public logout() {
        this.storage.set('auth', null);
        this.navCtrl.push(LoginPage);
    }

    openModalAdd() {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModal: Modal = this.modalCtrl.create(PostAddPage, myModalOptions);
        myModal.present();
    }

    openModalEdit(post) {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModal: Modal = this.modalCtrl.create(PostAddPage, { 'post': post }, myModalOptions);
        myModal.present();
    }

    closeModal() {
        return true;
    }

    share() {
        this.socialSharing.canShareVia(
            "Findwork for you",
            "Setting app to have many job for you",
            "Powergate company need 3 developer Node js",
            "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/15823472_1903496763215059_2160427870381018848_n.jpg?_nc_cat=0&oh=d6c75182f5c8cafe4dab2b2573559957&oe=5B48053D",
            "Powergatesoftware.com").
            then(data => console.log(data)).catch(error => console.log(error));
    }

    public savePost(postId: string) {
        this.userCurrent.likes[postId] = (this.userCurrent.likes && this.userCurrent.likes[postId]) ? false : true;
        this.userProvider.update(this.userCurrent).then(error => console.log(error));
    }

}


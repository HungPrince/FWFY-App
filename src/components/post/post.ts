import { Component, Input } from '@angular/core';
import { ModalOptions, Modal, ModalController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

import { PostAddPage } from '../../pages/post/post-add/post-add';
import { DetailUserPage } from '../../pages/user/detail-user/detail-user';
import { UserProvider } from '../../providers/user/user';
import { LoaderService } from '../../services/loaderService';
import { PostProvider } from '../../providers/post/post';
import { DetailPostPage } from '../../pages/post/detail-post/detail-post';


@Component({
    selector: 'post',
    templateUrl: 'post.html'
})

export class PostComponent {

    private userCurrent: any;
    @Input('postI') post: any;
    constructor(
        public storage: Storage,
        public modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController,
        public loaderService: LoaderService,
        private userProvider: UserProvider,
        private postProvider: PostProvider,
        private socialSharing: SocialSharing
    ) {
        this.storage.get('auth').then(user => {
            this.userCurrent = user;
        });
    }

    sharePost(post) {
        let sharePostActionSheet = this.actionSheetCtrl.create({
            title: "Share this post",
            buttons: [
                {
                    text: "Share on Facebook",
                    icon: "logo-facebook",
                    handler: () => {
                        this.socialSharing.shareViaFacebook(
                            post.description,
                            "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/15823472_1903496763215059_2160427870381018848_n.jpg?_nc_cat=0&oh=d6c75182f5c8cafe4dab2b2573559957&oe=5B48053D",
                            post.website
                        )
                    }
                },
                {
                    text: "Twitter",
                    icon: "logo-twitter",
                    handler: () => {
                        this.socialSharing.shareViaTwitter(
                            post.description,
                            "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/15823472_1903496763215059_2160427870381018848_n.jpg?_nc_cat=0&oh=d6c75182f5c8cafe4dab2b2573559957&oe=5B48053D",
                            post.website
                        )
                    }
                },
                {
                    text: "Share",
                    icon: "share",
                    handler: () => {
                        this.socialSharing.canShareVia(
                            "Findwork for you",
                            "Setting app to have many job for you",
                            "Powergate company need 3 developer Node js",
                            "https://scontent.xx.fbcdn.net/v/t1.0-1/p100x100/15823472_1903496763215059_2160427870381018848_n.jpg?_nc_cat=0&oh=d6c75182f5c8cafe4dab2b2573559957&oe=5B48053D",
                            "Powergatesoftware.com").
                            then(data => console.log(data)).catch(error => console.log(error));
                    }
                },
                {
                    text: "Cancel",
                    role: "destructive"
                }
            ]
        })
        sharePostActionSheet.present();
    }

    public savePost(postId: string) {
        if (!this.userCurrent.saves) {
            this.userCurrent.saves = {};
        }
        this.userCurrent.saves[postId] = (this.userCurrent.saves && this.userCurrent.saves[postId]) ? false : true;
        this.userProvider.update(this.userCurrent).then(error => console.log(error));
    }

    countLikes(post) {
        if (!post.post.likes) {
            return "like";
        } else {
            let likesNumber = Object.keys(post.post.likes).length;
            return likesNumber == 1 ? likesNumber + " like" : likesNumber + " likes";
        }
    }

    getNameIconLike(post) {
        let postInfo = post.post;
        if (this.userCurrent.likes && this.userCurrent.likes[postInfo.key]) {
            return 'thumbs-up';
        }
        return 'thumbs-up-outline';
    }

    likePost(post: any) {
        let key = post.key;
        if (!this.userCurrent.likes) {
            this.userCurrent.likes = {};
        }
        this.userCurrent.likes[key] = (this.userCurrent.likes && this.userCurrent.likes[key]) ? false : true;
        this.userProvider.update(this.userCurrent).then(error => {
            if (!error) {
                let userId = this.userCurrent.uid;
                if (!post.likes) {
                    post.likes = {};
                }
                post.likes[userId] = (post.likes && post.likes[userId]) ? null : userId;
                this.postProvider.update(post).then(post => console.log(post));
            }
        });
    };

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

    openModalDetail(post) {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModal: Modal = this.modalCtrl.create(DetailPostPage, { 'post': post }, myModalOptions);
        myModal.present();
    }

    public viewDetailUserPost(user) {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModal: Modal = this.modalCtrl.create(DetailUserPage, { 'user': user }, myModalOptions);
        myModal.present();
    }
}

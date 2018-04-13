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
                            post.image_url,
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
                            post.image_url,
                            post.website
                        );
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
        this.userProvider.update(this.userCurrent).then(error => {
            if (!error) {
                this.storage.set('auth', this.userCurrent);
            }
        });
    }

    countLikes(likes) {
        if (!likes) {
            return "like";
        } else {
            let likesNumber = likes.length;
            return likesNumber == 0 ? "like" : (likesNumber == 1 ? likesNumber + " like" : likesNumber + " likes");
        }
    }

    getNameIconLike(key) {
        return (this.userCurrent.likes && this.userCurrent.likes[key]) ? 'thumbs-up' : 'thumbs-up-outline';
    }

    getNameIconHeart(key) {
        return (this.userCurrent.saves && this.userCurrent.saves[key]) ? 'heart' : 'heart-outline';
    }

    likePost(post: any) {
        let key = post.key;
        if (!this.userCurrent.likes) {
            this.userCurrent.likes = [];
        }
        if (this.userCurrent.likes && this.userCurrent.likes[key]) {
            this.userCurrent.likes[key] = null;
        } else {
            this.userCurrent.likes.push({ key: true });
        }
        this.userProvider.update(this.userCurrent).then(error => {
            if (!error) {
                this.storage.set('auth', this.userCurrent);
                let userId = this.userCurrent.uid;
                if (!post.likes) {
                    post.likes = [];
                }
                if (post.likes && post.likes[userId]) {
                    post.likes[userId] = null;
                } else {
                    post.likes.push({ userId: true });
                }
                this.postProvider.update(post).then(error => {
                    if (!error) {
                        console.log(post.likes);
                    }
                });
            }
        });
    };

    openModalEdit(post) {
        this.openModal(PostAddPage, { 'post': post });
    }

    openModalDetail(post) {
        this.openModal(DetailPostPage, { 'post': post });
    }

    openDetailUserPost(user) {
        this.openModal(DetailUserPage, { 'user': user });
    }

    openModal(pageName, data) {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModal: Modal = this.modalCtrl.create(pageName, data, myModalOptions);
        myModal.present();
    }
}

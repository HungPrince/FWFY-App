import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { NavController, MenuController, ModalOptions, Modal, ModalController, ActionSheetController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

import { PostProvider } from '../../providers/post/post';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
import { PostAddPage } from '../post/post-add/post-add';
import { DetailUserPage } from '../user/detail-user/detail-user';
import { DetailPostPage } from '../post/detail-post/detail-post';
import { CITIES, TYPES, LEVELS } from '../../configs/data';

import { LoaderService } from '../../services/loaderService';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private listPost: Array<any> = [];
    private listSearch: any;
    private userCurrent: any;
    private listCity: any = [];
    types = TYPES;
    levels = LEVELS;
    private textShowHideAdvanced = "Show";
    private searchAdvandced = false;
    @ViewChild(Content) content: Content;
    constructor(public navCtrl: NavController, public storage: Storage, public menuCtrl: MenuController, public modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController,
        public postProvider: PostProvider, public loaderService: LoaderService, private userProvider: UserProvider,
        private socialSharing: SocialSharing) {
        CITIES.forEach(element => {
            for (let key in element) {
                this.listCity.push(element[key]);
            }
        });
        this.loaderService.loaderNoSetTime('loading ...');
            this.storage.get('auth').then(user => {
                if (user) {
                    this.userCurrent = user;
                    this.postProvider.getAll().subscribe((posts) => {
                        let listPostFree = [];
                        this.listPost = [];
                        let count = 0;
                        posts.forEach(post => {
                            this.userProvider.getUserByKey(post.userId).then(data => {
                                data = data.val();
                                let postI = {
                                    post: post,
                                    user: data,
                                    ownPost: user.uid == post.userId ? true : false
                                }
                                if (data['typeAccount'] == 'enterprise') {
                                    this.listPost.unshift(postI);
                                } else if (data['typeAccount'] == 'standard') {
                                    this.listPost.push(postI);
                                } else {
                                    listPostFree.push(postI);
                                }
                                count++;
                                if (count == posts.length) {
                                    this.listPost = this.listPost.concat(listPostFree);
                                    this.listSearch = this.listPost;
                                }
                            }).catch(error => {
                                this.showError(error);
                            });
                        }, (error) => {
                            this.showError(error);
                        });
    
                        this.loaderService.dismisLoader().then(data => {
                        }).catch(error => console.log(error));
                    }, (error) => {
                        this.showError(error);
                    });
                }
            }).catch(error => {
                this.showError(error);
            });
    }

    showError(error) {
        console.log(error);
        this.loaderService.dismisLoader().then(data => {
        }).catch(error => console.log(error));
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

    showSearchAdvanced() {
        this.content.scrollToTop();
        if (this.searchAdvandced) {
            this.textShowHideAdvanced = "Show";
        } else {
            this.textShowHideAdvanced = "Hide";
        }
        this.searchAdvandced = !this.searchAdvandced;
    }

    logout() {
        this.storage.set('auth', null).then(data => {
            this.navCtrl.push(LoginPage);
        });
    }

    getListPost(event) {
        let search = event.target.value ? event.target.value.toLowerCase() : "";
        this.searchPost(search);
    }

    searchPost(search: string) {
        let lstPost = [];
        if (search) {
            lstPost = this.listSearch.filter(post => (post.post.title.toLowerCase().indexOf(search) > -1)
                || post.post.city == search || post.post.type == search || post.post.level == search);
        }
        this.listPost = lstPost.length > 0 ? lstPost : this.listSearch;
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

    openModalDetail(post) {
        let myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
        };
        let myModal: Modal = this.modalCtrl.create(DetailPostPage, { 'post': post }, myModalOptions);
        myModal.present();
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

    public likePost(post: any) {
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
    }

    public viewDetailUserPost(user) {
        this.navCtrl.push(DetailUserPage, { "user": user });
    }
}

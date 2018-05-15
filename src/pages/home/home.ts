import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, ModalOptions, Modal, ModalController, Content } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { PostProvider } from '../../providers/post/post';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
import { CITIES, TYPES, LEVELS } from '../../configs/data';

import { LoaderService } from '../../services/loaderService';
import { PostAddPage } from '../post/post-add/post-add';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private
    private listPost: Array<any> = [];
    private listSearch: any;
    private userCurrent: any;
    private listCity: any = [];
    types = TYPES;
    levels = LEVELS;
    private textShowHideAdvanced = "Show";
    private searchAdvandced = false;
    private unSubcrible: Subscription;
    @ViewChild(Content) content: Content;
    constructor(
        public navCtrl: NavController,
        public storage: Storage,
        public menuCtrl: MenuController,
        public postProvider: PostProvider,
        public loaderService: LoaderService,
        private userProvider: UserProvider,
        private modalCtrl: ModalController
    ) {
        CITIES.forEach(element => {
            for (let key in element) {
                this.listCity.push(element[key]);
            }
        });

        this.loaderService.loaderNoSetTime('loading ...');
    }

    showError(error) {
        console.log(error);
        this.loaderService.dismisLoader().then(data => {
        }).catch(error => console.log(error));
    }

    ionViewDidLoad() {
        this.storage.get('auth').then(user => {
            if (user) {
                this.userCurrent = user;
                this.unSubcrible = this.postProvider.getAll().subscribe((posts) => {
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
                                this.storage.set('posts', this.listPost);
                                this.listSearch = this.listPost;
                                this.unSubcrible.unsubscribe();
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
                })
            }
        }).catch(error => {
            this.showError(error);
        });
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

    isAllowed() {
        if (!this.userCurrent) {
            return false;
        }
        return this.userCurrent.roles.admin || this.userCurrent.roles.author;
    }

    ngOnDestroy() {
        this.unSubcrible.unsubscribe();
    }

}

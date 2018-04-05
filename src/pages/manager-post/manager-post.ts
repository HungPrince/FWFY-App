import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { PostProvider } from '../../providers/post/post';
import { LoaderService } from '../../services/loaderService';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
    selector: 'page-manager-post',
    templateUrl: 'manager-post.html',
})
export class ManagerPostPage {

    public listPost: Array<any> = [];
    items = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private loaderService: LoaderService, private storage: Storage,
        private postProvider: PostProvider, private userProvider: UserProvider) {
        this.loaderService.loaderNoSetTime('loading ...');
        this.userProvider.test().then(data => {
            this.items = data.val();
            console.log(this.items);
            this.loaderService.dismisLoader();
        })
        // this.storage.get('auth').then(uid => {
        //     this.postProvider.getAll().subscribe((posts) => {
        //         posts.forEach(post => {
        //             if (post.userId == uid.toString()) {
        //                 this.listPost.push(post);
        //             }
        //         }, (error) => {
        //             this.loaderService.dismisLoader();
        //         });
        //         this.loaderService.dismisLoader();
        //     }, error => { console.log(error); this.loaderService.dismisLoader(); });
        // }).catch(error => { console.log(error); this.loaderService.dismisLoader() });
    }

    ionViewDidLoad() {

    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            let keyNext = Object.keys(this.items)[2];
            this.userProvider.testPagination(keyNext).then(data => {
                for (let i in data.val()) {
                    this.items.push(data.val()[i]);
                }
            });
            infiniteScroll.complete();
        }, 1000);
    };
}

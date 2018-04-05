import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Storage } from '@ionic/storage';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { Moment } from 'moment';
import * as moment from 'moment';

import { UntilHelper } from '../../../helpers/until.helper';
import { PostProvider } from '../../../providers/post/post';
import { LoaderService } from '../../../services/loaderService';
import { ToastService } from '../../../services/toastService';

import { FUNCTION_JOB, CITIES, DISTRICTS, STREETS } from '../../../configs/data';

@IonicPage()
@Component({
    selector: 'page-post-add',
    templateUrl: 'post-add.html'
})
export class PostAddPage implements OnInit {

    private formPost: any;
    private actionPost: string = "Create Post";
    public logoUrl;
    listCity = [];
    listDistrict = [];
    listStreet = [];
    private post: { [x: string]: any } = {};
    public listFunctionJob = FUNCTION_JOB;
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
        public formBuilder: FormBuilder, private storage: Storage, private untilHelper: UntilHelper,
        private postProvider: PostProvider, private params: NavParams,
        public loaderService: LoaderService, public toastService: ToastService) {
        let post = params.get('post');
        if (post) {
            this.post = post;
            this.actionPost = "Update Post";
            CITIES.forEach(element => {
                for (let key in element) {
                    if (element[key].name_with_type == post.city) {
                        this.changeCity(element[key]);
                        break;
                    }
                }
            });
            this.changeDistrict(post.address.district);
            this.formPost = this.formBuilder.group({
                'key': new FormControl(post.key),
                'company': new FormControl(post.company, [Validators.required]),
                'title': new FormControl(post.title, Validators.compose([Validators.required])),
                'city': new FormControl(post.city, Validators.required),
                'district': new FormControl(post.address.district, Validators.required),
                'street': new FormControl(post.address.street, Validators.required),
                'function': new FormControl(post.function, Validators.required),
                'type': new FormControl(post.type, Validators.required),
                'level': new FormControl(post.level, Validators.required),
                'website': new FormControl(post.website),
                'dateFrom': new FormControl(new Date(post.dateFrom), Validators.required),
                'dateTo': new FormControl(new Date(post.dateTo), Validators.required),
                'description': new FormControl(post.description, Validators.required),
            });
        } else {
            this.formPost = this.formBuilder.group({
                'company': new FormControl('', [Validators.required]),
                'title': new FormControl('', Validators.compose([Validators.required])),
                'city': new FormControl('', Validators.required),
                'district': new FormControl('', Validators.required),
                'street': new FormControl('', Validators.required),
                'function': new FormControl('', Validators.required),
                'type': new FormControl('Employment Type', Validators.required),
                'level': new FormControl('', Validators.required),
                'website': new FormControl(),
                'dateFrom': new FormControl(new Date(), Validators.required),
                'dateTo': new FormControl('', Validators.required),
                'description': new FormControl('', Validators.required),
            });
        }

        this.storage.get('auth').then(uid => {
            this.post.userId = uid;
        });

        if (!this.post.logoUrl) {
            this.logoUrl = "https://placehold.it/150x150";
        }

    }

    ionViewDidLoad() {
    }

    ngOnInit() {
        CITIES.forEach(element => {
            for (let key in element) {
                this.listCity.push(element[key]);
            }
        });
    }

    changeCity(city) {
        console.log(city);

        this.listDistrict = [];
        DISTRICTS.forEach(district => {
            for (let key in district) {
                if (district[key].parent_code === city.code) {
                    this.listDistrict.push({
                        code: district[key].code,
                        name: district[key].name
                    });
                }
            }
        });
    }

    changeDistrict(district) {
        this.listStreet = [];
        STREETS.forEach(street => {
            for (let key in street) {
                if (street[key].parent_code === district.code) {
                    this.listStreet.push({
                        code: street[key].code,
                        name: street[key].name
                    });
                }
            }
        });
    }

    goBack() {
        this.viewCtrl.dismiss();
    }

    save() {
        this.loaderService.loaderNoSetTime('save ...');
        let post = this.formPost.value;
        if (!this.post.key) {
            this.post.address = {};
        }

        for (let key in post) {

        }

        this.post.address = {};
        let valuePost = this.formPost.value;
        for (let key in valuePost) {
            if (key == "city" || key == "street" || key == "district") {
                this.post.address[key] = valuePost[key];
                if (key == "city") {
                    this.post[key] = valuePost[key];
                }
            }
            else if (key == "dateFrom" || key == "dateTo") {
                this.post[key] = moment(valuePost[key]).format('ll');
            }
            else {
                this.post[key] = valuePost[key];
            }
        }
        if (valuePost.key) {
            this.post.updatedAt = Date.now();
            this.postProvider.update(this.post).then(data => {
                this.loaderService.dismisLoader().then(data => {
                    this.goBack();
                    this.toastService.toast('Update post successfully', 1000, 'bottom', false);
                }).catch(error => { console.log(error); this.loaderService.dismisLoader() });
            });
        } else {
            this.post.createdAt = Date.now();
            this.postProvider.add(this.post).then(data => {
                this.loaderService.dismisLoader().then(data => {
                    this.goBack();
                    this.toastService.toast('Create post successfully', 1000, 'bottom', false);
                }).catch(error => { console.log(error); this.loaderService.dismisLoader() });
            });
        }
    }

    delete() {
        this.postProvider.delete(this.post.key).then(data => {
            console.log(data);
        })
    }
}

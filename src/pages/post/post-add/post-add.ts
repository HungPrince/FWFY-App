import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Validators, FormControl, FormBuilder } from '@angular/forms';

import { FormHelper } from '../../../helpers/form.helper';
import { PostProvider } from '../../../providers/post/post';
import { LoaderService } from '../../../services/loaderService';
import { ToastService } from '../../../services/toastService';

import { FUNCTION_JOB, CITIES, DISTRICTS, STREETS, TYPES, LEVELS } from '../../../configs/data';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

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
    listFunctionJob = FUNCTION_JOB;
    types = TYPES;
    levels = LEVELS;
    private emailRegex = "^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$";
    private phoneRegex = "^(01[2689]|09)[0-9]{8}$";
    private websiteRegex = "^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}$";
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public formBuilder: FormBuilder,
        private storage: Storage,
        private postProvider: PostProvider,
        public loaderService: LoaderService,
        private alertCtrl: AlertController,
        private formHelper: FormHelper,
        public toastService: ToastService) {
        let post = navParams.get('post');
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
            DISTRICTS.forEach(element => {
                for (let key in element) {
                    if (element[key].name == post.address.district) {
                        this.changeDistrict(element[key]);
                        break;
                    }
                }
            });
            this.formPost = this.formBuilder.group({
                'key': new FormControl(post.key),
                'company': new FormControl(post.company, [Validators.required]),
                'title': new FormControl(post.title, Validators.compose([Validators.required])),
                'email': new FormControl(post.email, Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])),
                'phone': new FormControl(post.phone, Validators.compose([Validators.required, Validators.pattern(this.phoneRegex)])),
                'city': new FormControl(post.city, Validators.required),
                'district': new FormControl(post.address.district, Validators.required),
                'street': new FormControl(post.address.street, Validators.required),
                'function': new FormControl(post.function, Validators.required),
                'type': new FormControl(post.type, Validators.required),
                'level': new FormControl(post.level, Validators.required),
                'website': new FormControl(post.website, Validators.compose([Validators.pattern(this.websiteRegex)])),
                'dateFrom': new FormControl(post.dateFrom, Validators.required),
                'dateTo': new FormControl(post.dateTo, Validators.required),
                'description': new FormControl(post.description, Validators.required),
            });
        } else {
            this.formPost = this.formBuilder.group({
                'company': new FormControl('', [Validators.required]),
                'title': new FormControl('', Validators.compose([Validators.required])),
                'email': new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])),
                'phone': new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.phoneRegex)])),
                'city': new FormControl('', Validators.required),
                'district': new FormControl('', Validators.required),
                'street': new FormControl('', Validators.required),
                'function': new FormControl('', Validators.required),
                'type': new FormControl('Employment Type', Validators.required),
                'level': new FormControl('', Validators.required),
                'website': new FormControl('', Validators.compose([Validators.pattern(this.websiteRegex)])),
                'dateFrom': new FormControl(new Date(), Validators.required),
                'dateTo': new FormControl(new Date(), Validators.required),
                'description': new FormControl('', Validators.required),
            });
        }

        this.storage.get('auth').then(user => {
            this.post.userId = user.uid;
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

    isError(inputName) {
        return this.formHelper.isError(this.formPost, inputName);
    }

    isErrorRequired(inputName) {
        return this.formHelper.isErrorRequired(this.formPost, inputName);
    }

    isErrorMinLength(inputName) {
        return this.formHelper.isErrorMinLength(this.formPost, inputName);
    }

    isErrorMaxLength(inputName) {
        return this.formHelper.isErrorMaxLength(this.formPost, inputName);
    }

    isErrorPattern(inputName) {
        return this.formHelper.isErrorPattern(this.formPost, inputName);
    }


    changeCity(city) {
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

        this.post.address = {};
        let valuePost = this.formPost.value;
        for (let key in valuePost) {
            if (key == "city" || key == "street" || key == "district") {
                this.post.address[key] = valuePost[key];
                if (key == "city") {
                    this.post[key] = valuePost[key];
                }
            }
            else {
                this.post[key] = valuePost[key];
            }
        }
        if (valuePost.key) {
            this.post.updatedAt = Date.now();
            this.postProvider.update(this.post).then(data => {
                this.loaderService.dismisLoader().then(data => {
                }).catch(error => { console.log(error); });
                this.toastService.toast('Update post successfully', 1000, 'bottom', false);
                this.goBack();
            });
        } else {
            this.post.createdAt = Date.now();
            this.postProvider.add(this.post).then(data => {
                if (data.key) {
                    this.loaderService.dismisLoader().then(data => {
                    }).catch(error => { console.log(error); });
                    this.toastService.toast('Create post successfully', 1000, 'bottom', false);
                    this.goBack();
                } else {
                    this.loaderService.dismisLoader();
                }
            });
        }
    }

    delete() {
        let alertDeleteCtrl = this.alertCtrl.create({
            title: 'Delete',
            message: 'Are you sure want to delete this post ?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('cancel clicked');
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.loaderService.loaderNoSetTime('deleting ...');
                        this.postProvider.delete(this.post).then(error => {
                            if (!error) {
                                this.loaderService.dismisLoader().then(data => {
                                }).catch(error => { console.log(); });
                                this.toastService.toast('Delete post successfully', 1000, 'bottom', false);
                                this.goBack();
                            } else {
                                this.loaderService.dismisLoader();
                            }
                        }).catch(error => { console.log(error); this.loaderService.dismisLoader(); });
                    }
                }
            ]
        });
        alertDeleteCtrl.present();

    }
}

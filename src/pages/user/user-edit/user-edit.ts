import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { CameraOptions, Camera } from '@ionic-native/camera';

import { LoaderService } from '../../../services/loaderService';
import { ToastService } from '../../../services/toastService';

import { UserProvider } from '../../../providers/user/user';
import { FormHelper } from '../../../helpers/form.helper';
import { CITIES, DISTRICTS, STREETS, SCHOOLS, SPECIALIZEDS, EXPERIENCES } from '../../../configs/data';
import { UntilHelper } from './../../../helpers/until.helper';


import firebase from 'firebase';

@IonicPage()
@Component({
    selector: 'page-user-edit',
    templateUrl: 'user-edit.html',
})
export class UserEditPage {
    listCity = [];
    listDistrict = [];
    listStreet = [];
    schools = SCHOOLS;
    specializeds = SPECIALIZEDS;
    experiences = EXPERIENCES;

    private emailRegex = "^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$";
    private phoneRegex = "^(01[2689]|09)[0-9]{8}$";
    private formEditUser;
    user: any;
    private storageFB = firebase.storage().ref();

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public camera: Camera,
        public formBuilder: FormBuilder,
        private viewCtrl: ViewController,
        private userProvider: UserProvider,
        private toastService: ToastService,
        private loaderService: LoaderService,
        private actionSheetCtrl: ActionSheetController,
        private untilHelper: UntilHelper,
        private formHelper: FormHelper) {
        this.user = this.navParams.get('user');

        CITIES.forEach(element => {
            for (let key in element) {
                if (element[key].name_with_type == this.user.city) {
                    this.changeCity(element[key]);
                    break;
                }
            }
        });
        DISTRICTS.forEach(element => {
            for (let key in element) {
                if (element[key].name == this.user.address.district) {
                    this.changeDistrict(element[key]);
                    break;
                }
            }
        });

        this.formEditUser = this.formBuilder.group({
            'uid': new FormControl(this.user.uid),
            'role': new FormControl({ value: this.user.role, 'disabled': true }),
            'name': new FormControl(this.user.name, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
            'userName': new FormControl(this.user.userName, [Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
            'companyName': new FormControl(this.user.companyName, [Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
            'email': new FormControl(this.user.email, Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])),
            'age': new FormControl(this.user.age),
            'gender': new FormControl(this.user.gender),
            'description': new FormControl(this.user.description),
            'experience': new FormControl(this.user.experience),
            'school': new FormControl(this.user.school),
            'specialized': new FormControl(this.user.specialized),
            'city': new FormControl(this.user.city, [Validators.required]),
            'street': new FormControl(this.user.address ? this.user.address.street : '', [Validators.required]),
            'district': new FormControl(this.user.address ? this.user.address.district : '', [Validators.required]),
            'location': new FormControl(this.user.address ? this.user.address.location : '', [Validators.required]),
            'phone': new FormControl(this.user.phone ? this.user.phone : '', [Validators.required, Validators.pattern(this.phoneRegex)]),
        });

        if (!this.user.avatar_url) {
            this.user.avatar_url = "https://placehold.it/150x150";
        }
    }

    ionViewDidLoad() {
        CITIES.forEach(element => {
            for (let key in element) {
                this.listCity.push(element[key]);
            }
        });
    }

    goBack() {
        this.viewCtrl.dismiss();
    }

    isError(inputName) {
        return this.formHelper.isError(this.formEditUser, inputName);
    }

    isErrorRequired(inputName) {
        return this.formHelper.isErrorRequired(this.formEditUser, inputName);
    }

    isErrorMinLength(inputName) {
        return this.formHelper.isErrorMinLength(this.formEditUser, inputName);
    }

    isErrorMaxLength(inputName) {
        return this.formHelper.isErrorMaxLength(this.formEditUser, inputName);
    }

    isErrorPattern(inputName) {
        return this.formHelper.isErrorPattern(this.formEditUser, inputName);
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

    save() {
        this.loaderService.loaderNoSetTime("saving profile ...");
        let user = this.formEditUser.value;
        for (let key in user) {
            if (key == 'city' || key == 'district' || key == 'street' || key == 'location') {
                this.user.address[key] = user[key];
                if (key == 'city') {
                    this.user.city = user[key];
                }
            } else {
                this.user[key] = this.untilHelper.niceString(user[key]);
            }
        }
        this.userProvider.update(user).then(error => {
            if (!error) {
                this.loaderService.dismisLoader().then(data => {
                    this.goBack();
                    this.toastService.toast('Save profile successfully !', 1000, 'bottom', false);
                }).catch(error => console.log(error));
            }
        });
    }

    chooseAvatar() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Choose image',
            buttons: [
                {
                    text: 'Choose from library',
                    role: 'destructive',
                    handler: () => {
                        this.takePicture(0);
                    }
                },
                {
                    text: 'Take capture',
                    handler: () => {
                        this.takePicture(1);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        actionSheet.present();
    }

    takePicture(sourceType) {
        let options: CameraOptions = {
            quality: 100,
            sourceType: sourceType,
            destinationType: this.camera.DestinationType.DATA_URL,
            saveToPhotoAlbum: true,
            correctOrientation: true
        }

        this.camera.getPicture(options).then((imageData) => {
            this.loaderService.loaderNoSetTime('uploading ...');
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.user.avatar_url = base64Image;
            let filename = Math.floor(Date.now() / 1000);
            let imageRef = this.storageFB.child(`images/${filename}.jpg`);
            imageRef.putString(base64Image, firebase.storage.StringFormat.DATA_URL).then((imageSnapshot) => {
                this.loaderService.dismisLoader().then((data) => {
                    this.user.avatar_url = imageSnapshot.downloadURL;
                }).catch(error => {
                    console.log(error);
                    this.loaderService.dismisLoader();
                });
            });
        }, (err) => {
            console.log(err);
            this.loaderService.dismisLoader();
        });
    }
}

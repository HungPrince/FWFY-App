import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, Events } from 'ionic-angular';
import { Validators, FormControl, FormBuilder } from '@angular/forms';

import { CameraOptions, Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';

import { CITIES, DISTRICTS, STREETS, SCHOOLS, SPECIALIZEDS, EXPERIENCES } from '../../configs/data';
import { UntilHelper } from '../../helpers/until.helper';
import { FormHelper } from '../../helpers/form.helper';
import { LoaderService } from '../../services/loaderService';
import { LoginPage } from '../login/login';
import { User } from './../../models/user';
import { UserProvider } from './../../providers/user/user';
import { ToastService } from '../../services/toastService';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterPage {
    typeSignUp: string = "applicant";
    user: User;
    listCity = [];
    listDistrict = [];
    listStreet = [];
    schools = SCHOOLS;
    specializeds = SPECIALIZEDS;
    experiences = EXPERIENCES;
    private emailRegex = "^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$";
    private phoneRegex = "^(01[2689]|09)[0-9]{8}$"
    private formRegister;
    private storageFB = firebase.storage().ref();
    constructor(public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        public camera: Camera,
        public formBuilder: FormBuilder,
        private untilHelper: UntilHelper,
        private formHelper: FormHelper,
        private loaderService: LoaderService,
        private userProvider: UserProvider,
        private toastService: ToastService,
        private events: Events,
        private storage: Storage) {
        this.user = new User('applicant', '', '', null, '', 18, '', '', null, true, '', '', '');
    
        this.user.avatar_url = "https://placehold.it/150x150";
        this.formRegister = this.formBuilder.group({
            'role': new FormControl(this.user.role, [Validators.required]),
            'name': new FormControl(this.user.name, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
            'userName': new FormControl(this.user.userName, [Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
            'companyName': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
            'email': new FormControl(this.user.email, Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50),
            ])),
            'passwordConfirm': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50),
            ])),
            'phone': new FormControl(this.user.phone, [Validators.required, Validators.pattern(this.phoneRegex)]),
            'city': new FormControl('', [Validators.required]),
            'street': new FormControl('', [Validators.required]),
            'district': new FormControl('', [Validators.required]),
            'location': new FormControl('', [Validators.required]),
            'description': new FormControl(''),
            'school': new FormControl(),
            'specialized': new FormControl(),
            'experience': new FormControl(),
            'age': new FormControl(),
            'gender': new FormControl(),
        });
    }

    ionViewDidLoad() {
        CITIES.forEach(element => {
            for (let key in element) {
                this.listCity.push(element[key]);
            }
        });
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

    isError(inputName) {
        return this.formHelper.isError(this.formRegister, inputName);
    }

    isErrorRequired(inputName) {
        return this.formHelper.isErrorRequired(this.formRegister, inputName);
    }

    isErrorMinLength(inputName) {
        return this.formHelper.isErrorMinLength(this.formRegister, inputName);
    }

    isErrorMaxLength(inputName) {
        return this.formHelper.isErrorMaxLength(this.formRegister, inputName);
    }

    isErrorPattern(inputName) {
        return this.formHelper.isErrorPattern(this.formRegister, inputName);
    }

    checkConfirmPassword() {
        return this.formRegister.controls['passwordConfirm'].value && (this.formRegister.controls['passwordConfirm'].value === this.formRegister.controls['password'].value) && !this.isError('passwordConfirm') && !this.isError('password');
    }

    goBack() {
        this.navCtrl.push(LoginPage);
    }

    doRegister() {
        this.loaderService.loaderNoSetTime('loading');
        this.user.address = {};
        this.user['createdAt'] = new Date();
        let user = this.formRegister.value;
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

        this.userProvider.register(this.user.email, this.formRegister.value.password).then(auth => {
            if (auth.uid) {
                this.user.uid = auth.uid;
                this.userProvider.create(this.user).then(data => {
                    this.storage.set('auth', this.user);
                    this.loaderService.dismisLoader().then(data => {
                        this.toastService.toast('Create account successfully!', 500, 'bottom', false);
                        this.navCtrl.setRoot(TabsPage);
                        this.events.publish('userLoggedIn', this.user);
                    });
                }).catch(error => {
                    this.loaderService.dismisLoader();
                    console.log(error);
                });
            } else {
                this.loaderService.dismisLoader();
            }
        }).catch(error => { console.log(error); this.loaderService.dismisLoader(); })
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
            this.user.avatar_url = 'data:image/jpeg;base64,' + imageData;;
            let filename = Math.floor(Date.now() / 1000);
            let imageRef = this.storageFB.child(`images/${filename}.jpg`);
            imageRef.putString(this.user.avatar_url, firebase.storage.StringFormat.DATA_URL).then((imageSnapshot) => {
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

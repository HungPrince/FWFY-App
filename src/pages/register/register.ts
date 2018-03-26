import { Component } from '@angular/core';
import { IonicPage, NavController, ActionSheetController } from 'ionic-angular';
import { Validators, FormControl, FormBuilder } from '@angular/forms';

import { CameraOptions, Camera } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

import { User } from './../../models/user';
import { UntilHelper } from '../../helpers/until.helper';

import firebase from 'firebase';
import { HomePage } from '../home/home';
import { LoaderService } from '../../services/loaderService';
import { CITIES, DISTRICTS, STREETS } from '../../configs/data';

@IonicPage()
@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterPage {
    typeSignUp: string = "applicant";
    user: User;
    base64Image: string;
    listCity = [];
    listDistrict = [];
    listStreet = [];
    private emailRegex = "^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$";
    private phoneRegex = "^(01[2689]|09)[0-9]{8}$"
    private formRegisterApplicant;
    private formRegisterRecuiter;
    private storageFB = firebase.storage().ref();
    constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController,
        public af: AngularFireDatabase, public camera: Camera, public formBuilder: FormBuilder,
        private untilHelper: UntilHelper, private loaderService: LoaderService, private afAuth: AngularFireAuth, private storage: Storage) {
        this.user = new User('', '', null, '', 18, '', '', null, true, '', '', '', '');

        this.base64Image = "https://placehold.it/150x150";

        this.formRegisterApplicant = this.formBuilder.group({
            'name': new FormControl(this.user.name, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
            'userName': new FormControl(this.user.userName, [Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(25),
            ])),
            'passwordConfirm': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(25),
            ])),
            'email': new FormControl(this.user.email, Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])),
            'age': new FormControl(this.user.age),
            'gender': new FormControl(this.user.gender),
            'description': new FormControl(this.user.description),
            'experience': new FormControl(this.user.experience),
            'school': new FormControl(this.user.school),
            'speciality': new FormControl(this.user.speciality),
            'avatar_url': new FormControl(this.base64Image),
            'file_url': new FormControl(this.user.avatar_url),
            'city': new FormControl('', [Validators.required]),
            'street': new FormControl('', [Validators.required]),
            'district': new FormControl('', [Validators.required]),
            'landAlleyBuilding': new FormControl('', [Validators.required]),
            'phone1': new FormControl(this.user.phone, [Validators.required, Validators.pattern(this.phoneRegex)]),
            'phone2': new FormControl(this.user.phone, [Validators.pattern(this.phoneRegex)]),
            'checked': new FormControl({ value: true, disabled: true }),
        });

        this.formRegisterRecuiter = this.formBuilder.group({
            'name': new FormControl(this.user.name, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
            'userName': new FormControl(this.user.name, [Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
            'email': new FormControl(this.user.email, Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(25),
            ])),
            'passwordConfirm': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(25),
            ])),
            'companyName': new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
            'phone1': new FormControl(this.user.phone, [Validators.required, Validators.pattern(this.phoneRegex)]),
            'phone2': new FormControl(this.user.phone, [Validators.pattern(this.phoneRegex)]),
            'city': new FormControl('', [Validators.required]),
            'street': new FormControl('', [Validators.required]),
            'district': new FormControl('', [Validators.required]),
            'landAlleyBuilding': new FormControl('', [Validators.required]),
            'description': new FormControl(''),
            'avatar_url': new FormControl(this.base64Image)
        })
    }

    ionViewDidLoad() {
        CITIES.forEach(element => {
            for (let key in element) {
                this.listCity.push(element[key]);
            }
        });
    }

    doRegisterApplicant() {
        this.loaderService.loaderNoSetTime('loading');
        this.user.userName = this.untilHelper.niceString(this.formRegisterApplicant.value.username);
        this.user.email = this.untilHelper.niceString(this.formRegisterApplicant.value.email);
        this.user.name = this.untilHelper.niceString(this.formRegisterApplicant.value.name);
        this.user.school = this.untilHelper.niceString(this.formRegisterApplicant.value.school);
        this.user.age = this.formRegisterApplicant.value.age;
        this.user.phone = {
            "phone1": this.formRegisterApplicant.value.phone1,
            "phone2": this.formRegisterApplicant.value.phone2,
        };
        this.user.gender = this.formRegisterApplicant.value.gender;
        this.user.address = {
            'city': this.formRegisterApplicant.value.city,
            'street': this.formRegisterApplicant.value.street,
            'district': this.formRegisterApplicant.value.district,
            'landAlleyBuilding': this.untilHelper.niceString(this.formRegisterApplicant.value.landAlleyBuilding)
        }
        this.user.speciality = this.formRegisterApplicant.value.speciality;
        this.user.role = 'applicant';
        this.user.description = this.untilHelper.niceString(this.formRegisterApplicant.value.description.trim());
        this.register(this.user, this.formRegisterApplicant.value.password);
    }

    doRegisterRecuiter() {
        this.loaderService.loaderNoSetTime('loading');
        this.user.userName = this.untilHelper.niceString(this.formRegisterRecuiter.value.username);
        this.user.email = this.untilHelper.niceString(this.formRegisterRecuiter.value.email);
        this.user.name = this.untilHelper.niceString(this.formRegisterRecuiter.value.name);
        this.user.phone = {
            "phone1": this.formRegisterRecuiter.value.phone1,
            "phone2": this.formRegisterRecuiter.value.phone2,
        };
        this.user.address = {
            'city': this.formRegisterRecuiter.value.city,
            'street': this.formRegisterRecuiter.value.street,
            'district': this.formRegisterRecuiter.value.district,
            'landAlleyBuilding': this.untilHelper.niceString(this.formRegisterRecuiter.value.landAlleyBuilding)
        }
        this.user.role = 'applicant';
        this.user.description = this.untilHelper.niceString(this.formRegisterRecuiter.value.description.trim());
        this.register(this.user, this.formRegisterRecuiter.value.password);
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

    register(user: User, password: string) {
        this.afAuth.auth.createUserWithEmailAndPassword(user.email, password).then((auth) => {
            return this.af.database.ref('users').child(auth.uid).set(this.user, (error) => {
                if (!error) {
                    this.storage.set('auth', auth.uid);
                    this.navCtrl.setRoot(HomePage);
                    this.loaderService.dismisLoader();
                } else {
                    this.loaderService.dismisLoader();
                    console.log(error);
                }
            }).catch((e) => console.log(e));
        }).catch((e) => console.log(e));
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
            this.base64Image = base64Image;
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

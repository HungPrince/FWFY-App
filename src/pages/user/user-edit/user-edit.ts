import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { LoaderService } from '../../../services/loaderService';
import { ToastService } from '../../../services/toastService';

import { UserProvider } from '../../../providers/user/user';

@IonicPage()
@Component({
    selector: 'page-user-edit',
    templateUrl: 'user-edit.html',
})
export class UserEditPage {

    private emailRegex = "^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$";
    private phoneRegex = "^(01[2689]|09)[0-9]{8}$";
    private formEditUser;
    user: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
        private viewCtrl: ViewController, private userProvider: UserProvider,
        private toastService: ToastService, private loaderService: LoaderService) {
        this.user = this.navParams.get('user');
        this.formEditUser = this.formBuilder.group({
            'name': new FormControl(this.user.name, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
            'userName': new FormControl(this.user.userName, [Validators.required, Validators.minLength(4), Validators.maxLength(24)]),
            'email': new FormControl(this.user.email, Validators.compose([Validators.required, Validators.pattern(this.emailRegex)])),
            'age': new FormControl(this.user.age),
            'gender': new FormControl(this.user.gender),
            'description': new FormControl(this.user.description),
            'experience': new FormControl(this.user.experience),
            'school': new FormControl(this.user.school),
            'speciality': new FormControl(this.user.speciality),
            'avatar_url': new FormControl(this.user.avatar_url),
            'file_url': new FormControl(this.user.avatar_url),
            'city': new FormControl(this.user.address ? this.user.address.city : '', [Validators.required]),
            'street': new FormControl(this.user.address ? this.user.address.street : '', [Validators.required]),
            'district': new FormControl(this.user.address ? this.user.address.district : '', [Validators.required]),
            'landAlleyBuilding': new FormControl(this.user.address ? this.user.address.landAlleyBuilding : '', [Validators.required]),
            'phone1': new FormControl(this.user.phone ? this.user.phone.phone1 : '', [Validators.required, Validators.pattern(this.phoneRegex)]),
            'phone2': new FormControl(this.user.phone ? this.user.phone.phone2 : '', [Validators.pattern(this.phoneRegex)]),
        });
    }

    goBack() {
        this.viewCtrl.dismiss();
    }

    ionViewDidLoad() {
    }

    save() {
        this.loaderService.loaderNoSetTime("saving profile ...");
        let usr = this.formEditUser.value();
        usr.id = this.user.id;
        this.userProvider.update(usr).then(error => {
            if (!error) {
                this.loaderService.dismisLoader().then(data => {
                    this.goBack();
                    this.toastService.toast('Save profile successfully !', 1000, 'bottom', false);
                });
            }
        });
    }

}

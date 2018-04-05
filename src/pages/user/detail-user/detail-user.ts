import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer';

import { CallNumber } from '@ionic-native/call-number';

import { User } from '../../../models/user';

@IonicPage()
@Component({
    selector: 'detail-user',
    templateUrl: 'detail-user.html',
})
export class DetailUserPage {
    private formEmail;
    private emailRegex = "^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$";
    private user: User;
    viewMore: string = 'info';
    constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
        public callNumber: CallNumber, private emailComposer: EmailComposer) {
        this.user = this.navParams.get('user');

        this.formEmail = this.formBuilder.group({
            'emailTo': new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)]),
            'emailCC': new FormControl('', [Validators.pattern(this.emailRegex)]),
            'emailBCC': new FormControl('', [Validators.pattern(this.emailRegex)]),
            'attachment': new FormControl(''),
            'subject': new FormControl('', [Validators.required]),
            'body': new FormControl('', Validators.required),
        });

    }

    ionViewDidLoad() {
    }

    call(phoneNumber) {
        this.callNumber.callNumber(phoneNumber, true).then(() => {
            console.log('Launched dialer');
        }).catch(() => {
            console.log('error launched dialer');
        });
    }

    sendEmail() {
        let email = {
            to: this.formEmail.value.emailTo,
            cc: this.formEmail.value.emailCC,
            bcc: this.formEmail.value.emailBCC,
            attachments: [this.formEmail.value.attachment],
            subject: this.formEmail.value.subject,
            body: this.formEmail.value.body
        }

        this.emailComposer.open(email).then(data => console.log(data))
            .catch(error => console.log(error));
    }
}

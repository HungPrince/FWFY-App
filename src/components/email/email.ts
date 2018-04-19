import { Component } from '@angular/core';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer';

import { FormHelper } from '../../helpers/form.helper';
import { EMAIL_CONTACT } from '../../configs/config';

@Component({
    selector: 'email',
    templateUrl: 'email.html'
})
export class EmailComponent {

    private formEmail: any;
    private emailRegex = "^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$";
    private emailContact = EMAIL_CONTACT;
    constructor(
        private formBuilder: FormBuilder,
        private formHelper: FormHelper,
        private emailComposer: EmailComposer
    ) {
        this.formEmail = this.formBuilder.group({
            'emailTo': new FormControl(this.emailContact, [Validators.required, Validators.pattern(this.emailRegex)]),
            'emailCC': new FormControl('', [Validators.pattern(this.emailRegex)]),
            'emailBCC': new FormControl('', [Validators.pattern(this.emailRegex)]),
            'subject': new FormControl('', [Validators.required]),
            'body': new FormControl('', Validators.required),
        });
    }

    isError(inputName) {
        return this.formHelper.isError(this.formEmail, inputName);
    }

    isErrorRequired(inputName) {
        return this.formHelper.isErrorRequired(this.formEmail, inputName);
    }

    isErrorPattern(inputName) {
        return this.formHelper.isErrorPattern(this.formEmail, inputName);
    }

    sendEmail() {
        let email = {
            to: this.formEmail.value.emailTo,
            cc: this.formEmail.value.emailCC,
            bcc: this.formEmail.value.emailBCC,
            subject: this.formEmail.value.subject,
            body: this.formEmail.value.body
        }

        this.emailComposer.open(email).then(data => console.log(data))
            .catch(error => console.log(error));
    }
}

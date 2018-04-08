import { Injectable } from "@angular/core";

@Injectable()
export class FormHelper {
    isError(formControlName, inputName) {
        return formControlName.controls[inputName].errors && (formControlName.controls[inputName].dirty || formControlName.controls[inputName].touched);
    }

    isErrorRequired(formControlName, inputName) {
        return formControlName.controls[inputName].errors.required;
    }

    isErrorMinLength(formControlName, inputName) {
        return formControlName.controls[inputName].errors.minlength;
    }

    isErrorMaxLength(formControlName, inputName) {
        return formControlName.controls[inputName].errors.maxlength;
    }

    isErrorPattern(formControlName, inputName) {
        return formControlName.controls[inputName].errors.pattern;
    }

}

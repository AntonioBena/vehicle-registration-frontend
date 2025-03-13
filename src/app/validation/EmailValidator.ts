import { AbstractControl, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const emailField = control.value;

    if (!emailField) {
      return { emailInvalid: true };
    }

    const emailPattern = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
    const isValidEmail = emailPattern.test(emailField);
    const isValidLength = emailField.length > 8 && emailField.length < 30; //Consider about this

    return isValidEmail && isValidLength ? null : { emailInvalid: true };
  };
}

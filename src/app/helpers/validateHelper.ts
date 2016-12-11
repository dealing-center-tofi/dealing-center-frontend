import { FormControl, FormGroup } from '@angular/forms';


export class ValidateHelper {
  static ALLOWED_LENGTHS_FOR_CREDIT_CARD = [13, 16];
  static ALLOWED_LENGTHS_FOR_CVV = [3];
  static MASTERCARD_START_STRINGS = ['51', '52', '53', '54', '55'];
  static VISA_START_STRINGS = ['4'];
  static AMOUNT_REGEXP = /^(?:\d*\.)?\d+$/;
  static NOT_DIGITS_REGEXP = /\D/;
  static EXPIRY_DATE_REGEXP = /^(0[1-9]|1[0-2])\/(\d{2})$/;
  static NOT_DIGITS_NOT_WORDS_REGEXP = /[^\w\d]/;
  static EMAIL_REGEXP_REGEXP = /.+@.+\..+/i;
  static CAPITAL_LETTER_REGEXP = /[A-Z]/;
  static LOWER_LETTER_REGEXP = /[a-z]/;
  static DIGITS_REGEXP = /\d/;
  static NOT_WORDS_REGEXP = /\W/;

  static makeControlError(control, errorMessages) {
    control.markAsTouched();
    control.markAsDirty();
    let newError = {'serverError': errorMessages};
    control.errors ?
      control.setErrors(Object.assign(control.errors, newError), true) :
      control.setErrors(newError, true);
  };

  static checkErrors(form, formErrors, validationMessages) {
    if (!form) {
      return;
    }

    for (const field in formErrors) {
      // clear previous error message (if any)
      formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = validationMessages[field];
        for (const key in control.errors) {
          if (key === 'serverError') {
            control.errors['serverError'].forEach((errMessage) => {
              formErrors[field] += errMessage;
            })
          } else {
            formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  }

  static makeFieldsAsTouched(form:FormGroup) {
    for (let name in form.controls) {
      form.controls[name].markAsTouched();
    }
  };


  static validateEmail(c:FormControl) {
    if (!c.value) return;

    return ValidateHelper.EMAIL_REGEXP_REGEXP.test(c.value) ? null : {
      validateEmail: {
        valid: false
      }
    };
  }

  static onlyWordsDigits(c:FormControl) {
    if (!c.value) return;

    return ValidateHelper.NOT_WORDS_REGEXP.test(c.value) ? {
      onlyWordsDigits: {
        valid: false
      }
    } : null;
  }

  static needsCapitalLetter(c:FormControl) {
    if (!c.value) return;

    return ValidateHelper.CAPITAL_LETTER_REGEXP.test(c.value) ? null : {
      needsCapitalLetter: {
        valid: false
      }
    };
  }

  static needsLowerlLetter(c:FormControl) {
    if (!c.value) return;

    return ValidateHelper.LOWER_LETTER_REGEXP.test(c.value) ? null : {
      needsLowerlLetter: {
        valid: false
      }
    };
  }

  static needsNumber(c:FormControl) {
    if (!c.value) return;

    return ValidateHelper.DIGITS_REGEXP.test(c.value) ? null : {
      needsNumber: {
        valid: false
      }
    };
  }

  static needsSpecialCharacter(c:FormControl) {
    if (!c.value) return;

    return ValidateHelper.NOT_DIGITS_NOT_WORDS_REGEXP.test(c.value) ? null : {
      needsSpecialCharacter: {
        valid: false
      }
    };
  }

  static areEqual(group:FormGroup) {
    var valid = true;

    for (name in group.controls) {
      var val = group.controls[name].value;

      for (name in group.controls) {
        var val2 = group.controls[name].value;
        if (val != val2) {
          valid = false;
        }
      }

    }

    if (valid) {
      return null;
    }

    return {
      areEqual: true
    };
  }

  static validateCardNumberLength(c:FormControl) {
    if (!c.value) return;
    let allowedLengths = ValidateHelper.ALLOWED_LENGTHS_FOR_CREDIT_CARD;

    return allowedLengths.includes(c.value.length) ? null : {
      validateCardNumberLength: {
        valid: false
      }
    };
  }

  static validateCardCvvLength(c:FormControl) {
    if (!c.value) return;
    let allowedLengths = ValidateHelper.ALLOWED_LENGTHS_FOR_CVV;

    return allowedLengths.includes(c.value.length) ? null : {
      validateCardCvvLength: {
        valid: false
      }
    };
  }

  static validateCardNumberBeginning(c:FormControl) {
    if (!c.value) return;

    let allStartNumbers = ValidateHelper.MASTERCARD_START_STRINGS.concat(ValidateHelper.VISA_START_STRINGS);

    return allStartNumbers.some((str) => c.value.startsWith(str)) ? null : {
      validateCardNumberBeginning: {
        valid: false
      }
    };
  }

  static validateAmount(c:FormControl) {
    if (!c.value) return;

    return ValidateHelper.AMOUNT_REGEXP.test(c.value) ? null : {
      validateAmount: {
        valid: false
      }
    };
  }

  static validateDigits(c:FormControl) {
    if (!c.value) return;

    return !ValidateHelper.NOT_DIGITS_REGEXP.test(c.value) ? null : {
      validateDigits: {
        valid: false
      }
    };
  }

  static validateExpiryDate(c:FormControl) {
    var getDate = function () {
      let month = parseInt(resultRegexp[1]);
      let year = parseInt(resultRegexp[2]) + 2000;
      let expiryDate = new Date(year, month);
      return new Date(expiryDate.setDate(expiryDate.getDate() + 1));
    };

    if (!c.value) return;

    let isValid = false;
    let resultRegexp = ValidateHelper.EXPIRY_DATE_REGEXP.exec(c.value);

    if (resultRegexp) {
      var expiryDate = getDate();
      let nowDate = new Date(Date.now());
      isValid = expiryDate <= nowDate ? false : true;
    }

    return isValid ? null : {
      validateExpiryDate: {
        valid: false
      }
    };
  }
}

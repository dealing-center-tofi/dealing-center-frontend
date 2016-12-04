import { FormControl } from '@angular/forms';


export class ValidateHelper {
  static ALLOWED_LENGTHS_FOR_CREDIT_CARD = [13, 16];
  static ALLOWED_LENGTHS_FOR_CVV = [3];
  static MASTERCARD_START_STRINGS = ['51', '52', '53', '54', '55'];
  static VISA_START_STRINGS = ['4'];
  static AMOUNT_REGEXP = /(?:\d*\.)?\d+/;
  static NOT_DIGITS_REGEXP = /\D/;
  static EXPIRY_DATE_REGEXP = /^(0[1-9]|1[0-2])\/(\d{2})$/;



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
    if (!c.value) return;

    return ValidateHelper.EXPIRY_DATE_REGEXP.test(c.value) ? null : {
      validateExpiryDate: {
        valid: false
      }
    };
  }
}

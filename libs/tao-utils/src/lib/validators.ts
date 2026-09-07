import { ValidatorFn, Validators } from '@angular/forms';
import { TaoPatterns } from './patterns';

export class TaoValidators {
  static alphabetic(): ValidatorFn {
    return Validators.pattern(TaoPatterns.alphabetic);
  }

  static alphabeticWithSpaces(): ValidatorFn {
    return Validators.pattern(TaoPatterns.alphabeticWithSpaces);
  }

  static numeric(): ValidatorFn {
    return Validators.pattern(TaoPatterns.numeric);
  }

  static alphanumeric(): ValidatorFn {
    return Validators.pattern(TaoPatterns.alphanumeric);
  }

  static email(): ValidatorFn {
    return Validators.pattern(TaoPatterns.email);
  }
}

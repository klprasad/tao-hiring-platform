import { Component, inject, input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'tao-input',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './tao-input.component.html',
  styleUrl: './tao-input.component.scss',
})
export class TaoInputComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input('');
  readonly required = input(false);
  readonly type = input('text');
  readonly hint = input('');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly prefix = input('');
  readonly suffix = input('');
  readonly showErrors = input(false);

  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  protected readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: () =>
      Boolean(this.ngControl?.invalid && (this.ngControl.touched || this.ngControl.dirty)),
  };
  protected value = '';
  protected isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  protected onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}

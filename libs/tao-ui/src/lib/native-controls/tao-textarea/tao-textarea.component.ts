import { Component, inject, input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'tao-textarea',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './tao-textarea.component.html',
  styleUrl: './tao-textarea.component.scss',
})
export class TaoTextareaComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input('');
  readonly rows = input(4);
  readonly required = input(false);
  readonly maxLength = input<number | null>(null);
  readonly disabled = input(false);
  readonly showErrors = input(false);
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  protected readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: () =>
      Boolean(this.ngControl?.invalid && (this.ngControl.touched || this.ngControl.dirty)),
  };
  protected value = '';
  protected isDisabled = false;
  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

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
    this.value = (event.target as HTMLTextAreaElement).value;
    this.onChange(this.value);
  }
}

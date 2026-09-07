import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'tao-input',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TaoInputComponent), multi: true },
  ],
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

  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  protected value = '';
  protected isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

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

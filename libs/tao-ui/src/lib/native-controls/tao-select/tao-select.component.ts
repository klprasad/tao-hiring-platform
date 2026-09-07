import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'tao-select',
  imports: [FormsModule, MatFormFieldModule, MatSelectModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TaoSelectComponent), multi: true },
  ],
  templateUrl: './tao-select.component.html',
  styleUrl: './tao-select.component.scss',
})
export class TaoSelectComponent implements ControlValueAccessor {
  readonly label = input('Select');
  readonly options = input<string[]>([]);
  readonly multiple = input(false);
  readonly placeholder = input('Select an option');
  readonly required = input(false);
  readonly disabled = input(false);
  readonly hint = input('');

  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  protected value: string | string[] = '';
  protected isDisabled = false;

  private onChange: (value: string | string[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | string[] | null): void {
    this.value = value ?? (this.multiple() ? [] : '');
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  protected onSelectionChange(value: string | string[]): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}

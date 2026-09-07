import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'tao-date-picker',
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TaoDatePickerComponent),
      multi: true,
    },
  ],
  templateUrl: './tao-date-picker.component.html',
  styleUrl: './tao-date-picker.component.scss',
})
export class TaoDatePickerComponent implements ControlValueAccessor {
  readonly label = input('Date');
  readonly placeholder = input('Choose a date');
  readonly required = input(false);
  readonly disabled = input(false);
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  protected value: Date | null = null;
  protected isDisabled = false;
  private onChange: (value: Date | null) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: Date | null): void {
    this.value = value;
  }
  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  protected onDateChange(value: Date | null): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}

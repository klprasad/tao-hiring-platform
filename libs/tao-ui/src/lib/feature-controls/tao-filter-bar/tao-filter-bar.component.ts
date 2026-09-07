import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'tao-filter-bar',
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TaoFilterBarComponent),
      multi: true,
    },
  ],
  templateUrl: './tao-filter-bar.component.html',
  styleUrl: './tao-filter-bar.component.scss',
})
export class TaoFilterBarComponent implements ControlValueAccessor {
  readonly placeholder = input('Search');
  readonly disabled = input(false);
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  protected value = '';
  protected isDisabled = false;
  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

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
}

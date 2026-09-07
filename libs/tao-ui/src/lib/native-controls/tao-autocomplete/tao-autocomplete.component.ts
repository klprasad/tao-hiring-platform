import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'tao-autocomplete',
  imports: [FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TaoAutocompleteComponent),
      multi: true,
    },
  ],
  templateUrl: './tao-autocomplete.component.html',
  styleUrl: './tao-autocomplete.component.scss',
})
export class TaoAutocompleteComponent implements ControlValueAccessor {
  readonly label = input('Search');
  readonly placeholder = input('Start typing');
  readonly options = input<string[]>([]);
  readonly required = input(false);
  readonly hint = input('');
  readonly disabled = input(false);
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
  protected onOptionSelected(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
  protected onBlur(): void {
    this.onTouched();
  }
}

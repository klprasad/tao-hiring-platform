import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'tao-textarea',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TaoTextareaComponent),
      multi: true,
    },
  ],
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
    this.value = (event.target as HTMLTextAreaElement).value;
    this.onChange(this.value);
  }
}

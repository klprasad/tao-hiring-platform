import { Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'tao-answer-editor',
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TaoAnswerEditorComponent),
      multi: true,
    },
  ],
  templateUrl: './tao-answer-editor.component.html',
  styleUrl: './tao-answer-editor.component.scss',
})
export class TaoAnswerEditorComponent implements ControlValueAccessor {
  readonly placeholder = input('Write your answer...');
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

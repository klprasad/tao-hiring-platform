import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaoInputComponent } from './tao-input.component';

describe('TaoInputComponent', () => {
  let fixture: ComponentFixture<TaoInputComponent>;
  let component: TaoInputComponent;
  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaoInputComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('writes model values into the input and normalizes null values', async () => {
    component.writeValue('Candidate name');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host().querySelector<HTMLInputElement>('input')?.value).toBe('Candidate name');

    component.writeValue(null);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host().querySelector<HTMLInputElement>('input')?.value).toBe('');
  });

  it('sends changed values to the registered callback', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);
    const input = host().querySelector<HTMLInputElement>('input')!;
    input.value = 'Updated value';
    input.dispatchEvent(new Event('input'));

    expect(onChange).toHaveBeenCalledWith('Updated value');
  });

  it('marks the control touched on blur', () => {
    const onTouched = vi.fn();
    component.registerOnTouched(onTouched);
    host().querySelector('input')?.dispatchEvent(new Event('blur'));

    expect(onTouched).toHaveBeenCalledOnce();
  });

  it('disables the native input when the form control is disabled', async () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host().querySelector<HTMLInputElement>('input')?.disabled).toBe(true);
  });
});

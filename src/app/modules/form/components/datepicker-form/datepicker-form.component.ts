import { ChangeDetectionStrategy, Component, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { ProfileFormValues } from './datepicker-form.interface';

@UntilDestroy()
@Component({
  selector: 'app-datepicker-form',
  templateUrl: './datepicker-form.component.html',
  styleUrls: ['./datepicker-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatepickerFormComponent),
      multi: true
    }
  ]
})
export class DatepickerFormComponent implements ControlValueAccessor, OnDestroy {

  public form: FormGroup;
  public subscription: Subscription[] = [];

  get value(): ProfileFormValues {
    return this.form.value;
  }

  set value(value: ProfileFormValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();

  }

  get myForm() {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedDate: ['', Validators.required],
    });

    this.subscription
      .push(
        this.form.valueChanges
          .pipe(untilDestroyed(this))
          .subscribe((value: {[name: string]: string}) => {            
            this.onChange(value);
            this.onTouched();
          })
    );
  }

  onChange:  any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
      this.onChange = fn;
  }

  writeValue(): void {
    this.form.reset();
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.form.valid ? null : { profile: { valid: false, }, };
  }

  ngOnDestroy(): void {
    this.subscription.forEach((s: any) => s.unsubscribe)
  }
}

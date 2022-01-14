import { ChangeDetectionStrategy, Component, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EMAIL_PATTERN } from './profile-form.const';
import { ProfileFormValues } from './profile-form.interface';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProfileFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ProfileFormComponent),
      multi: true
    }
  ]
})
export class ProfileFormComponent implements ControlValueAccessor, OnDestroy {

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
      fullName: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      }),
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(EMAIL_PATTERN),
        ])
      ],
      phone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9 ]*$')
      ]),
      ]
    });

    this.subscription
      .push(
        this.form.valueChanges.subscribe((value: any) => {
          this.onChange(value);
          this.onTouched();
        })
    );
  }

  onChange: any = () => {};
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

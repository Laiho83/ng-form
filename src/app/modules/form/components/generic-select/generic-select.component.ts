import { ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GenericSelectValues } from './generic-select.interface';

@Component({
  selector: 'app-generic-select',
  templateUrl: './generic-select.component.html',
  styleUrls: ['./generic-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenericSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GenericSelectComponent),
      multi: true
    }
  ]
})

export class GenericSelectComponent implements ControlValueAccessor, OnDestroy, OnInit {


  @Input() options: any;
  @Input() placeholder: string = '';
  @Input() errorMsg: string = '';
  @Input() searchControl: string = '';
  @Input() optionsDisplay?: string[];


  public form: FormGroup;
  public subscription: Subscription[] = [];

  get value(): GenericSelectValues {
    return this.form.value;
  }

  set value(value: GenericSelectValues) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();

  }

  get myForm() {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      [this.searchControl]: ['', [Validators.required]]
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
    return this.form.valid ? null : { appointment: { valid: false, }, };
  }

  changeEvent(e: any) {

  }

  ngOnDestroy(): void {
    this.subscription.forEach((s: any) => s.unsubscribe)
  }
}

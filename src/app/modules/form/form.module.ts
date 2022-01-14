import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { GenericSelectComponent } from './components/generic-select/generic-select.component';
import { FormsModule } from '@angular/forms';
import { DatepickerFormComponent } from './components/datepicker-form/datepicker-form.component';


@NgModule({
  declarations: [
    FormComponent,
    ProfileFormComponent,
    GenericSelectComponent,
    DatepickerFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    FormComponent,
    ProfileFormComponent,
    GenericSelectComponent,
    DatepickerFormComponent,
  ]
})
export class FormModule { }

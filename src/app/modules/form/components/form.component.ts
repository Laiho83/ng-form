import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Barber, Booked, Services } from '../../../interfaces/api.interface';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { TimeService } from '../../../services/time.service';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

  public bookingForm: FormGroup;
  public getBarbers$: Observable<Barber>;
  public getServices$: Observable<Services>;
  public getWorkingHours$: BehaviorSubject<any[]>;
  public bookedAppointment: Booked = {
    startDate: 0,
    barberId: 0,
    serviceId: 0
  };
  public content = {
    title: "Book your Appointment",
    barbersSelect: {
      placeholder: 'Select Barver',
      errorMsg: 'Please select a barber',
      searchControl: 'barbers',
      optionsDisplay: ['firstName', 'lastName'],
    },
    servicesSelect: {
      placeholder: 'Select Service',
      errorMsg: 'Please select a service',
      searchControl: 'services',
      optionsDisplay: ['name'],
    },
    servicesTime: {
      placeholder: 'Select Time',
      errorMsg: 'Please select a barber and date first',
      errorMsgSecondary: 'Please pick a time',
      searchControl: 'time',
    },
    cta: 'BOOK APOINTMENT'
  };

  constructor(
    private api: ApiService,
    private timeService: TimeService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.bookingForm = this.fb.group({
      profile: [],
      apponintmentBarber: [],
      apponintmentService: [],
      apponintmentDate: [],
      apponintmentTime: [],
      servicePrice: ''
    });

    this.getBarbers$ = this.getBarbers();
    this.getServices$ = this.getServices();

    this.getWorkingHours$ = new BehaviorSubject(['']);
    this.getWorkingHours();

    this.getPrice();
    this.setBooking();
  }

  getBarbers(): Observable<Barber> {
    return this.api.getBarbers();
  }

  getServices(): Observable<Services> {
    return this.api.getServices();
  }

  getWorkingHours() {
    combineLatest([
          this.bookingForm.get('apponintmentBarber')!.valueChanges,
          this.bookingForm.get('apponintmentDate')!.valueChanges,
    ])
    .pipe(untilDestroyed(this))
    .subscribe(([{barbers}, {selectedDate}]) => {
      this.content.servicesTime.errorMsg = (barbers.workHours, selectedDate).length > 1
        ? this.content.servicesTime.errorMsgSecondary
        : this.content.servicesTime.errorMsg;

        if((barbers.workHours, selectedDate).length > 1) {
          this.getWorkingHours$.next(
            this.timeService.setWorkHours(barbers.workHours, selectedDate, 0.5)
          );
        } else {
          this.getWorkingHours$.next([]);
        }
        this.bookingForm.get('apponintmentTime')?.setValue([]);
    });
  }

  getPrice() {
    this.bookingForm.get('apponintmentService')!.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(({services}) => {
        this.bookingForm.get('servicePrice')?.setValue(services.price);
      })
  }

  setBooking() {
    this.bookingForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(({apponintmentDate, apponintmentTime, apponintmentService, apponintmentBarber}) => {
        if(this.bookingForm.valid) {
          if(apponintmentDate && apponintmentTime) {
            this.bookedAppointment.startDate = Number(this.toTimestamp(apponintmentDate.selectedDate, apponintmentTime.time));
          }
          this.bookedAppointment.barberId = apponintmentBarber?.barbers.id
          this.bookedAppointment.serviceId = apponintmentService?.services.id
        }
    })
  }

  toTimestamp(getDate: string, getTime: string) {
    return new Date(getDate + ' ' + getTime);
  }

  onSubmit() {
    if(this.bookingForm.valid) {
      this.api.postAppointment(this.bookedAppointment)
        .pipe(untilDestroyed(this))
        .subscribe(a => {
          this.router.navigate(['success'])
        });
    }
  }
}

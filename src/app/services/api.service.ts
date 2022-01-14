import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Barber, Services, Appointments } from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private readonly apiRoot = 'http://localhost:3000';
  private readonly gliphyUrl = 'http://api.giphy.com/v1/gifs/search?api_key=KeTn0RgXZQF8EDkUGgQmSaJYuWPEz5mI&q=barber';

  constructor(
    private http: HttpClient
  ) { }

  getBarbers(): Observable<Barber> {
    return this.http.get<Barber>(`${this.apiRoot}/barbers`)
      .pipe(
        map((barbers: Barber) => {
          return barbers;
        }),
        catchError((error: Error) => {
          console.error(error);
          return throwError(() => error);
        })
      )
  }

  getServices(): Observable<Services> {
    return this.http.get<Services>(`${this.apiRoot}/services`)
      .pipe(
        map((services: Services) => {
          return services;
        }),
        catchError((error: Error) => {
          console.error(error);
          return throwError(() => error);
        })
      )
  }

  getAppointments(): Observable<Appointments> {
    return this.http.get<Appointments>(`${this.apiRoot}/appointments`)
      .pipe(
        map((appointments: Appointments) => {
          return appointments;
        }),
        catchError((error: Error) => {
          console.error(error);
          return throwError(() => error);
        })
      )
  }

  postAppointment(apointment: Appointments): Observable<Appointments> {
    return this.http.post<Appointments>(`${this.apiRoot}/appointments`, apointment)
      .pipe(
        catchError((error: Error) => {
          console.error(error);
          return throwError(() => error);
        })
      )
  }

  getGiphy(): Observable<any> {
    return this.http.get<any>(`${this.gliphyUrl}`)
      .pipe(
        map((gliphy: {[key: string]: []}) => {
          return gliphy['data'].map((gliphy: any) => {
            console.log(gliphy.images);
            return gliphy.images.original.url;
          });
        }),
        catchError((error: Error) => {
          console.error(error);
          return throwError(() => error);
        })
      )
  }
}

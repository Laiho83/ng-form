export interface Barber {
  id: number;
  firstName: string;
  lastName: string;
  workHours: WorkHours[];
}

export interface WorkHours {
  id: number;
  day: number;
  startHour: number;
  endHour: string;
  lunchTime?: {
    startHour?: number;
    durationMinutes?: number;
  }
}

export interface Appointments {
  id?: number;
  startDate: number;
  barberId: number;
  serviceId: number;
}

export interface Services {
  "id": number;
  "name": string;
  "durationMinutes": number;
  "price": string;
}

export interface Booked {
  "startDate": number;
  "barberId": number;
  "serviceId": number;
}

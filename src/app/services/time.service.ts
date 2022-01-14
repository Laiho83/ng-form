import { Injectable } from '@angular/core';
import { WorkHours } from '../../../../backup/src/app/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class TimeService {

  constructor() { }

  setWorkHours(workHours: WorkHours[], selectedDate: Date, duration: number): string[] {
      const d = new Date(selectedDate);
      let day = d.getDay();
      let workingDay = workHours.filter((curr: WorkHours) => curr.day === day)[0];

      if(!workingDay) {
        return [];
      }

      let timeArr = [workingDay.startHour];

      for(let i=0; timeArr[i] <= parseInt(workingDay.endHour); i++) {
        timeArr.push(timeArr[i] +
          (workingDay.lunchTime?.startHour! === (Number(timeArr[i]) + duration)
            ? (workingDay.lunchTime?.durationMinutes! / 60)*2
            : duration)
          )
      }


      return timeArr.map((hours: number) => {
        var rhours = Math.floor(hours);
        var rminutes = String(Math.round((hours - rhours) * 60));
        return `${rhours}:${ rminutes == '0' ? '00' : rminutes}`;
      });
  }
}

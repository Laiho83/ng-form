import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  public imgSrc: string = '';

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.api.getGiphy().subscribe((gliphy: {[key: string]: []}[]) => {
      this.imgSrc = String(gliphy[(this.randomGipfy(1, gliphy.length))]);

    });
  }

  randomGipfy(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

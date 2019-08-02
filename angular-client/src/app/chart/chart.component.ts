import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor(private dataSvc: DataService) { }

  ngOnInit() {
    console.log(this.dataSvc.access_token);
    console.log(this.dataSvc.token_type);
  }

}

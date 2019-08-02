import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { image } from 'src/app/shared/models/image';
import { topartists } from 'src/app/shared/models/topartists';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-artist-chart',
  templateUrl: './artist-chart.component.html',
  styleUrls: ['./artist-chart.component.css']
})
export class ArtistChartComponent implements OnInit {

  constructor(private dataSvc: DataService) { }

  imageArray: Array<image>;
  topArtists: topartists;
  data$: Observable<topartists>;

  ngOnInit() {
    this.data$ = this.dataSvc.getTopArtists();

    this.dataSvc.getTopTracks().subscribe(
      res => {
        console.log(res);
      }
    )
    this.dataSvc.getTopArtists().subscribe(
      res => {
        console.log(res);
      }
    )
  }

}

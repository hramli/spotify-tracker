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
  artistData$: Observable<topartists>;
  trackData$: Observable<any>; //make a model of top tracks

  ngOnInit() {
    this.artistData$ = this.dataSvc.getTopArtists();
    this.trackData$ = this.dataSvc.getTopTracks();

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

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
  }

  filterLength(name: string){
    let strippedNameByDash = name.split('-');
    let strippedNameByParenthesis = name.split('(');
    console.log(strippedNameByParenthesis);
    if(strippedNameByDash.length > 1)
    {
      let strippedNameDash = strippedNameByDash[0];
      if(strippedNameByParenthesis.length > 1)
      {
        let strippedNameParenthesis = strippedNameByParenthesis[0];
        if(strippedNameDash.length < strippedNameParenthesis.length)
          return strippedNameByDash;
        return strippedNameParenthesis;
      }
      return name.split('-')[0];
    }
    return strippedNameByParenthesis[0];
  }
  
}

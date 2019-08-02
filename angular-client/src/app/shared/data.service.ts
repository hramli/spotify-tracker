import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { topartists } from './models/topartists';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public baseUrl = "http://localhost:3000";
  private genreUrl = this.baseUrl + "/api/genre";
  private artistUrl = this.baseUrl + "/api/artist";
  private tracksUrl = this.baseUrl + "/api/track";

  public token_type: string;
  public access_token: string;
  public queryString: string;

  topArtists: BehaviorSubject<topartists>;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(
      params => {
        this.token_type = params.token_type;
        this.access_token = params.access_token;
        this.queryString = `?token_type=${this.token_type}&access_token=${this.access_token}`;

        this.getTopArtists().subscribe(
          (res: topartists) => {
            this.topArtists = new BehaviorSubject(res);
          }
        )
      }
    );
  }

  getTopGenres(time_range?: string): Observable<Array<Array<any>>>{
    if(time_range == null)
      time_range = "medium_term";
    else if(time_range != "short_term" && time_range != "medium_term" && time_range != "long_term")
    {
      let errorMsg: Array<Array<any>>;
      let msg: Array<any>;
      msg[0] = "invalid time_range";
      errorMsg[0] = msg;
      return of(errorMsg);
    }
    return this.http.get<Array<Array<any>>>(this.genreUrl+this.queryString+`&time_range=${time_range}`);
  }

  getAllTopGenres(): Promise<any>{
    return new Promise((resolve, reject) => 
    {
      try{
        //allData[0] = short_term, allData[1] = medium_term, allData[2] = long_term
        let allData: Array<Array<Array<any>>> = [];
        this.getTopGenres("short_term").subscribe(res => 
          {
            allData[0] = res;
            this.getTopGenres("medium_term").subscribe(res => 
              {
                allData[1] = res;
                this.getTopGenres("long_term").subscribe(res => 
                  {
                    allData[2] = res;
                    resolve(allData);
                  });
              });
          });
      }
      catch{
        reject({
          message: "failed to get top genres"
        });
      }
    });
  }

  getPercentages(data: Array<Array<any>>){
    let numItems = data.length;
    let total = 0;
    for(let i = 0; i < numItems; i++)
    {
      total += data[i][1];
    }
    for(let j = 0; j < numItems; j++)
    {
      data[j][1] = Math.round(data[j][1]*100.0/total)/100;
    }
    return data;
  }

  getTopArtists(){
    return this.http.get<topartists>(this.artistUrl+this.queryString);
  }

  getTopTracks(){
    return this.http.get(this.tracksUrl+this.queryString);
  }
}

//add models
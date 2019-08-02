import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { RouterModule } from '@angular/router';
import { GenreChartComponent } from './chart/genre-chart/genre-chart.component';
import { ArtistChartComponent } from './chart/artist-chart/artist-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    GenreChartComponent,
    ArtistChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    RouterModule.forRoot([
      {path: '', component: ChartComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

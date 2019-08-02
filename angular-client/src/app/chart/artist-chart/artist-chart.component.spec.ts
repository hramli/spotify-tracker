import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistChartComponent } from './artist-chart.component';

describe('ArtistChartComponent', () => {
  let component: ArtistChartComponent;
  let fixture: ComponentFixture<ArtistChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

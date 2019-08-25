import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from 'src/app/shared/data.service';
import { Router } from '@angular/router';
import { apiUrl } from 'src/app/shared/models/constants';
import { from, Subscription } from 'rxjs';
import { color, entries, path } from 'd3';

@Component({
  selector: 'app-genre-chart',
  templateUrl: './genre-chart.component.html',
  styleUrls: ['./genre-chart.component.css']
})
export class GenreChartComponent implements OnInit, OnDestroy {
  //0 = short, 1 = medium (default), 2 = long
  time_range: number; 

  //global chart properties
  allData: [][];
  numItems = 10;

  //lollipop chart properties
  @ViewChild('lollipopChart', {static: true})
  lollipopChartElement: ElementRef;

  x: d3.ScaleLinear<number, number>;
  y: d3.ScaleBand<string>;
  lollipopData: any;
  svg: d3.Selection<any, unknown, null, undefined>;
  yAxis: d3.Selection<any, unknown, null, undefined>;
  xAxis: d3.Selection<any, unknown, SVGElement, unknown>;
  
  //d3 donut chart properties
  @ViewChild('donutChart', {static: true})
  donutChartElement: ElementRef;

  donutData: any;


  //loading spinner
  loadingChart = true;

  //subscriptions
  updateGenreSubscription: Subscription;

  constructor(private dataSvc: DataService,
              private router: Router) {
    this.time_range = 1;
  }

  ngOnInit() {
    this.dataSvc.getAllTopGenres().then(
      (res) => {
        this.allData = res;
        this.buildLollipopChart();
        this.buildDonutChart();
      }
    ).finally(
      () => {
        this.loadingChart = false;
      }
    );

    //set updateGenre subscription
    this.updateGenreSubscription = this.dataSvc.updateGenres$.subscribe(
      //update genre charts
      (res: number) => {
        this.updateLollipopChart(res);
      }
    );
  }

  ngOnDestroy() {
    if(this.updateGenreSubscription)
      this.updateGenreSubscription.unsubscribe();
  }

  buildLollipopChart(){
    this.lollipopData = this.allData[this.time_range].slice(0,this.numItems);

    let margin = {top: 10, right: 30, bottom:40, left:80};
    let width = 350 - margin.left - margin.right;
    let height = 500 - margin.top - margin.bottom;

    this.svg = d3.select(this.lollipopChartElement.nativeElement)
      .append("svg")
      .style("display","block")
      .style("margin","auto")
      .style("margin-top","1em")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 450 500")
      .classed("svg-content", true)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("color", "white");

    this.x = d3.scaleLinear()
      .range([0, width]);
    
    this.xAxis = this.svg.append("g")
      .attr("transform", "translate(0," + height + ")");

    this.y = d3.scaleBand()
      .range([0, height])
      .padding(1);
    
    this.yAxis = this.svg.append("g");

    this.dataSvc.updateGenres$.next(1);
    
  }

  buildDonutChart(){
    let margin = 30;
    let width = 350;
    let height = 400;

    let radius = (Math.min(width, height) / 2) - margin ;

    let donutSvg = d3.select(this.donutChartElement.nativeElement)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," +
        height / 2 + ")");
  
    let data = {};
    let domain = [];
    let values; 
    values = 
    
    this.donutData = this.allData[2].slice(0,this.numItems);
    for(let i = 0; i < this.numItems; i++)
    {
      let item = this.donutData[i];
      data[item[0]] = item[1];
    }

    let colorScheme: any = d3.scaleOrdinal(["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b", "#002910"])
      .domain(domain);
      // .range(values);
      // .range(['#1ED761', '#1ac157', '#17ab4d', '#149443', '#117937' ,'#0e672f']);

    let pie: any = d3.pie()
      .value(function (d: any) {  return d.value });
    
    
    let data_ready = pie(d3.entries(data)) //if d3.entries(this.donutData), .value(d) d = [key: 0, value: Array[2]]

    let arc = d3.arc()
      .innerRadius(90)
      .outerRadius(radius);

    let label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    let g = donutSvg
      .selectAll('.arc')
      .data(data_ready)
      .enter();

    //donut shadow 
    let defs = donutSvg.append("defs");

    let filter = defs.append("filter")
        .attr("id", "dropshadow")
  
    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 4)
        .attr("result", "blur");
    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 3)
        .attr("dy", 3)
        .attr("result", "offsetBlur");
  
    var feMerge = filter.append("feMerge");
  
    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    //append paths
    g.append('path')
        .attr('d', arc)
        .attr('filter', 'none')
        .attr('fill',(d: any) => { return colorScheme(d.data.key) })
        .style("opacity", 0.9)
        .on('mouseover', function(d: any, index){
          let paths: any = donutSvg.selectAll('path');
          let hoveredPath: SVGPathElement = paths._groups[0][index];

          //add shadow on hover
          hoveredPath.setAttribute('style', 'filter: url(#dropshadow)');

          //set genre text styles
          text.style("visibility","visible")
          .text(d.data.key);
        })
        .on('mouseleave', function(d, index){
          text.style('visibility', 'hidden');
          let paths: any = donutSvg.selectAll('path');
          let hoveredPath: SVGPathElement = paths._groups[0][index];

          //remove shadow on mouse leave
          hoveredPath.setAttribute('style', 'filter: none;');
          hoveredPath.setAttribute('style', 'opacity: 0.9;');
        })

    let text = donutSvg.append('text')
      .style("fill","white")
      .style("visibility","visible")
      .style("text-anchor", "middle")
      .style("font-size", "10px");
  }
  
  //re-update charts
  setLollipopChart(time_range: number){
    this.dataSvc.updateGenres$.next(time_range);
  }

  updateLollipopChart(time_range){

    this.lollipopData = this.allData[time_range].slice(0,this.numItems);
    let maxDomainRange = Math.ceil(this.lollipopData[0][1] / 10) * 10;

    let y = this.y.domain(this.lollipopData.map(function(d) { return d[0];}));
    let x = this.x.domain([0, maxDomainRange]);

    this.yAxis.call(d3.axisLeft(this.y));
    this.xAxis
          .call(d3.axisBottom(this.x).ticks(maxDomainRange/5)) //ticks to set intervals in x-axis
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end")
          .style("color", "white");

    let lines = this.svg.selectAll<SVGLineElement,any>(".myline")
      .data(this.lollipopData);

    lines
      .enter()
      .append("line")
      .attr("class","myline")
      .merge(lines)
      .transition()
      .duration(1000)
        .attr("x1", function(d) { return x(d[1]);})
        .attr("x2", x(0))
        .attr("y1", function(d) { return y(d[0]);})
        .attr("y2", function(d) { return y(d[0]);})
        .attr("stroke", "white");

    let circles = this.svg.selectAll<SVGCircleElement, any>("circle")
      .data(this.lollipopData);

    circles
      .enter()
      .append("circle")
      .attr("stroke", "white")
      .on("mouseover", function(d) {
        text.style("visibility","visible")
          .attr("x", x(d[1]) + 10)
          .attr("y", y(d[0]) + 5)
          .text(`${d[0]}: ${d[1]}`);
      })
      .on("mouseout", function(d) {
        text.style("visibility","hidden");
      })
      .merge(circles)
      .transition()
      .duration(1000)
        .attr("cx", function(d) { return x(d[1]);})
        .attr("cy", function(d) { return y(d[0]);})
        .attr("r", "5")
        .style("fill", "#1ed760");
        
        
      //on mouseover, attr callback function(d) return x(d) gives undefined error

      var tooltip = this.svg
          .append("rect")
          .attr("width", 30)
          .attr("height", 20)
          .style("visibility","hidden")
          .style("fill","white");
      
      var text = this.svg
          .append("text")
          .style("fill","white")
          .style("visibility","hidden")
          .style("font-size", "10px");
      
      }

 
}

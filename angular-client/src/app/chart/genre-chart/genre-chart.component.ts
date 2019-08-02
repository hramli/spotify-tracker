import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from 'src/app/shared/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-genre-chart',
  templateUrl: './genre-chart.component.html',
  styleUrls: ['./genre-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenreChartComponent implements OnInit {
  @ViewChild('chart', {static: true})
  chartElement: ElementRef;

  //0 = short, 1 = medium (default), 2 = long
  time_range: number; 

  x: d3.ScaleLinear<number, number>;
  y: d3.ScaleBand<string>;
  data: any;
  svg: d3.Selection<any, unknown, null, undefined>;
  allData: any;
  yAxis: d3.Selection<any, unknown, null, undefined>;
  xAxis: d3.Selection<any, unknown, SVGElement, unknown>;

  constructor(private dataSvc: DataService,
              private router: Router) {
    this.time_range = 1;
  }

  ngOnInit() {
    this.buildLollipopChart();
  }

  buildLollipopChart(){
    this.dataSvc.getAllTopGenres().then(
      (res) => 
      {
        console.log(res);
        if(res.status == 400)
          this.router.navigate([this.dataSvc.baseUrl]);

        this.allData = res;
        this.data = res[this.time_range].slice(0,11);

        let margin = {top: 10, right: 30, bottom:40, left:100};
        let width = 460 - margin.left - margin.right;
        let height = 500 - margin.top - margin.bottom;
    
        this.svg = d3.select(this.chartElement.nativeElement)
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .style("display","block")
          .style("margin","auto")
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .style("color", "white");
    
        this.x = d3.scaleLinear()
          .domain([0, Math.ceil(this.data[0][1] / 10) * 10 * 2])
          .range([0, width]);
        
        this.xAxis = this.svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(this.x))
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end")
          .style("color", "white");
    
        this.y = d3.scaleBand()
          .range([0, height])
          .padding(1);
        
        this.yAxis = this.svg.append("g");

        this.updateLollipopChart(1);
    });
  }

  updateLollipopChart(time_range){

    this.data = this.allData[time_range].slice(0,11);
    console.log(this.data);

    let y = this.y.domain(this.data.map(function(d) { return d[0];}));
    let x = this.x.domain([0, Math.ceil(this.data[0][1] / 10) * 10 * 2]);

    this.yAxis.call(d3.axisLeft(this.y));

    let lines = this.svg.selectAll<SVGLineElement,any>(".myline")
      .data(this.data);

    // lines.exit().remove();

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
      .data(this.data);

    // circles.exit().remove();

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

    // circles.exit().remove();

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
      
      // this.svg.selectAll("circle")
      //   .transition()
      //   .duration(2000)
      //   .attr("cx", function(d) { return x(d[1]);})

      // this.svg.selectAll("line")
      //   .transition()
      //   .duration(2000)
      //   .attr("x1", function(d) { return x(d[1]);})
      }

 
}

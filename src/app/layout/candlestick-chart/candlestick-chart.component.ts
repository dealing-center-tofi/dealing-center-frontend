import { Component, OnInit, ElementRef } from '@angular/core';
import {HistoryValuesConstsService} from "../../services/historyValuesConsts.service";
import {ApiService} from "../../services/api.service";

declare let jQuery: any;
declare let d3: any;
declare let nv: any;

@Component({
  selector: '[candlestick-chart]',
  templateUrl: './candlestick-chart.template.html'
})
export class CandlesTickChart implements OnInit {
  $el: any;
  private chart: any;
  private data = {};
  private chartSettings = new CandlesTickChartSettings();
  private currentPeriod = this.historyValuesConsts.PERIOD_5_MINUTES;

  constructor(el: ElementRef,
              private historyValuesConsts: HistoryValuesConstsService,
              private apiService: ApiService) {
    this.$el = jQuery(el.nativeElement);
  }

  ngOnInit(): void {
    this.apiService.getCurrencyPairValuesHistory(1, this.currentPeriod)
      .then((res) => {
        console.log(res);
        this.data[this.currentPeriod] = res.results;
        this.data[this.currentPeriod].forEach(function (value) {
          value.date = new Date(value.creation_time).getTime();
        });
        this.sortData(this.data[this.currentPeriod]);
        this.initCandlestickChart();
      });
  }

  initCandlestickChart(): any {
    let data = this.data[this.currentPeriod];

    this.chartSettings.calculateBounds(data);
    this.chartSettings.setUpDrawingArea();
    this.chartSettings.setUpScales();
    this.chartSettings.setUpAxes();

    this.chartSettings.createDataSeries(data);

    this.chartSettings.setUpZoomingAndPanning(data);


    let daysShown = 10;
    this.chartSettings.xScale.domain([
      data[data.length - daysShown - 1].date,
      data[data.length - 1].date
    ]);


    this.chartSettings.redrawChart();
    this.chartSettings.updateZoomFromChart();
  }


  sortData(data) {
    data.sort(function (a, b) {
      if (a.date < b.date)
        return -1;
      if (a.date > b.date)
        return 1;
      return 0;
    });
  }
}

class CandlesTickChartSettings {
  private minDate;
  private maxDate;
  private yMin;
  private yMax;
  private margin;
  private width;
  private height;
  private plotChart;
  private plotArea;
  private xAxis;
  private yAxis;
  private dataSeries;
  private series;
  private zoom;
  private yScale;
  public xScale;

  calculateBounds(data) {
    this.minDate = d3.min(data, function (d) { return d.date; });
    this.maxDate = d3.max(data, function (d) { return d.date; });
    this.yMin = d3.min(data, function (d) { return d.low; });
    this.yMax = d3.max(data, function (d) { return d.high; });
  };

  setUpDrawingArea() {
    this.margin = {top: 20, right: 20, bottom: 30, left: 55};
    this.width = 660 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.plotChart = d3.select('#candlestick-chart').classed('chart', true).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.plotArea = this.plotChart.append('g')
      .attr('clip-path', 'url(#plotAreaClip)');

    this.plotArea.append('clipPath')
      .attr('id', 'plotAreaClip')
      .append('rect')
      .attr({ width: this.width, height: this.height });
  }

  setUpScales() {
    this.xScale = d3.time.scale();
    this.yScale = d3.scale.linear();

    // Set scale domains
    this.xScale.domain([this.minDate, this.maxDate]);
    this.yScale.domain([this.yMin, this.yMax]).nice();

    // Set scale ranges
    this.xScale.range([0, this.width]);
    this.yScale.range([this.height, 0]);
  }

  setUpAxes() {
    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient('bottom')
      .ticks(5);

    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient('left');

    this.plotChart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);

    this.plotChart.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);
  }

  createDataSeries(data) {
    this.series = CandlesTickChartSettings.createCandlesTickSeries()
        .xScale(this.xScale)
        .yScale(this.yScale);

    this.dataSeries = this.plotArea.append('g')
        .attr('class', 'series')
        .datum(data)
        .call(this.series);
  }

  static createCandlesTickSeries() {
    let xScale = d3.time.scale(),
      yScale = d3.scale.linear();

    let isUpDay = function(d) {
      return d.close > d.open;
    };

    let isDownDay = function (d) {
      return !isUpDay(d);
    };

    let line = d3.svg.line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });

    let highLowLines = function (bars) {
      let paths = bars.selectAll('.high-low-line').data(function (d) {
        return [d];
      });
      paths.enter().append('path');
      paths.classed('high-low-line', true)
        .attr('d', function (d) {
          return line([
            { x: xScale(d.date), y: yScale(d.high) },
            { x: xScale(d.date), y: yScale(d.low) }
          ]);
        });
    };

    let rectangles = function (bars) {
      let rect,
        rectangleWidth = 5;

      rect = bars.selectAll('rect').data(function (d) {
        return [d];
      });
      rect.enter().append('rect');
      rect
        .attr('x', function (d) {
            return xScale(d.date) - rectangleWidth;
        })
        .attr('y', function (d) {
            return isUpDay(d) ? yScale(d.close) : yScale(d.open);
        })
        .attr('width', rectangleWidth * 2)
        .attr('height', function (d) {
          return isUpDay(d) ?
            yScale(d.open) - yScale(d.close) :
            yScale(d.close) - yScale(d.open);
        });
      rect.exit().remove();
    };

    let candlestick = function (selection) {
      let series, bars;

      selection.each(function (data) {
        series = d3.select(this);
        bars = series.selectAll('.bar')
          .data(data, function (d) {
            return d.date;
          });
        bars.enter()
          .append('g')
          .classed('bar', true);
        bars.classed({
          'up-day': isUpDay,
          'down-day': isDownDay
        });
        highLowLines(bars);
        rectangles(bars);
        bars.exit().remove();
      });
    };

    candlestick.xScale = function (value) {
      if (!arguments.length) {
        return xScale;
      }
      xScale = value;
      return candlestick;
    };

    candlestick.yScale = function (value) {
      if (!arguments.length) {
        return yScale;
      }
      yScale = value;
      return candlestick;
    };

    return candlestick;
  }

  setUpZoomingAndPanning(data) {
    let self = this;

    this.zoom = d3.behavior.zoom()
      .x(this.xScale)
      .on('zoom', function() {
        if (self.xScale.domain()[0] < self.minDate) {
          self.zoom.translate([self.zoom.translate()[0] - self.xScale(self.minDate) + self.xScale.range()[0], 0]);
        } else if (self.xScale.domain()[1] > self.maxDate) {
          self.zoom.translate([self.zoom.translate()[0] - self.xScale(self.maxDate) + self.xScale.range()[1], 0]);
        }
        self.redrawChart();
      });

    let overlay = d3.svg.area()
      .x(function (d) { return self.xScale(d.date); })
      .y0(0)
      .y1(this.height);

    this.plotArea.append('path')
      .attr('class', 'overlay')
      .attr('d', overlay(data))
      .call(this.zoom);
  }


  // Helper functions

  redrawChart() {
      this.dataSeries.call(this.series);
      this.plotChart.select('.x.axis').call(this.xAxis);
  }

  updateZoomFromChart() {
      let fullDomain = this.maxDate - this.minDate,
        currentDomain = this.xScale.domain()[1] - this.xScale.domain()[0];
      let minScale = currentDomain / fullDomain,
        maxScale = minScale * 20;
      this.zoom.x(this.xScale)
        .scaleExtent([minScale, maxScale]);
  }
}

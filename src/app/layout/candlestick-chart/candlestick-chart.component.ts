import { Component, OnInit, ElementRef } from '@angular/core';
import {HistoryValuesConstsService} from "../../services/historyValuesConsts.service";
import {ApiService} from "../../services/api.service";

declare let jQuery: any;
declare let d3: any;
declare let nv: any;

@Component({
  selector: '[candlestick-chart]',
  templateUrl: './candlestick-chart.template.html',
  inputs: ['currencyPair']
})
export class CandlesTickChart implements OnInit {
  $el: any;

  public currencyPair;
  private currencyPairId;

  private data = {};
  private chartSettings = new CandlesTickChartSettings();
  wasInitialized = false;

  currentPeriod = this.historyValuesConsts.PERIOD_5_MINUTES;
  periodChoices = [
    {value: this.historyValuesConsts.PERIOD_5_MINUTES, displayName: '5M'},
    {value: this.historyValuesConsts.PERIOD_15_MINUTES, displayName: '15M'},
    {value: this.historyValuesConsts.PERIOD_30_MINUTES, displayName: '30M'},
    {value: this.historyValuesConsts.PERIOD_1_HOUR, displayName: '1H'},
    {value: this.historyValuesConsts.PERIOD_4_HOURS, displayName: '4H'},
    {value: this.historyValuesConsts.PERIOD_1_DAY, displayName: '1D'},
    {value: this.historyValuesConsts.PERIOD_1_WEEK, displayName: '1W'},
  ];

  changeCurrentPeriod(period) {
    this.currentPeriod = period;
    if (this.data[this.currentPeriod] === undefined) {
      this.apiService.getCurrencyPairValuesHistory(this.currencyPairId, this.currentPeriod)
        .then((res) => {
          this.data[period] = res;
          this.normalizeDate(this.data[period].results);

          let data = this.data[period].results;
          this.sortData(data);

          this.chartSettings.redrawOnNewData(data);
        });
    } else {
      this.chartSettings.redrawOnNewData(this.data[period].results)
    }
  }

  afterChangeCurrencyPair() {
    this.data = {};
    this.apiService.getCurrencyPairValuesHistory(this.currencyPairId, this.currentPeriod)
      .then((res) => {
        this.data[this.currentPeriod] = res;
        this.normalizeDate(this.data[this.currentPeriod].results);

        let data = this.data[this.currentPeriod].results;
        this.sortData(data);

        this.chartSettings.redrawOnNewData(data);
      });
  }

  constructor(el: ElementRef,
              private historyValuesConsts: HistoryValuesConstsService,
              private apiService: ApiService) {
    this.$el = jQuery(el.nativeElement);
  }

  ngOnInit(): void {
    this.currencyPair.subscribe((elem) => {
      if (elem && this.currencyPairId !== elem.id) {
        this.currencyPairId = elem.id;

        if (!this.wasInitialized)
          this.firstInit();
        else
          this.afterChangeCurrencyPair();
      }
    });
  }

  firstInit() {
    this.wasInitialized = true;

    this.apiService.getCurrencyPairValuesHistory(this.currencyPairId, this.currentPeriod)
      .then((res) => {
        this.data[this.currentPeriod] = res;
        this.normalizeDate(this.data[this.currentPeriod].results);
        this.sortData(this.data[this.currentPeriod].results);
        this.initCandlestickChart();
      });
  }

  initCandlestickChart(): any {
    let data = this.data[this.currentPeriod].results;

    this.chartSettings.calculateBounds(data);
    this.chartSettings.setUpDrawingArea();
    this.chartSettings.setUpScales();
    this.chartSettings.setUpAxes();
    this.chartSettings.createDataSeries(data);
    this.chartSettings.setUpZoomingAndPanning(data);

    this.chartSettings.onZoom(() => {
      if (this.chartSettings.xScale.domain()[0] < this.data[this.currentPeriod].results[20].date) {
        this.loadMoreValues();
      }
    });
    this.chartSettings.onZoom(() => {
      this.chartSettings.recalculateYAxis(this.data[this.currentPeriod].results);
      this.chartSettings.updateYScaleDomain();
      this.chartSettings.redrawChart();
    });


    let daysShown = (data.length >= 20 ? 20 : data.length) - 1;
    this.chartSettings.xScale.domain([
      data[data.length - daysShown - 1].date,
      data[data.length - 1].date
    ]);

    this.chartSettings.recalculateYAxis(data);
    this.chartSettings.updateYScaleDomain();


    this.chartSettings.redrawChart();
    this.chartSettings.updateZoomFromChart();
  }

  loadMoreValues() {
    if (this.data[this.currentPeriod].next && !this.data[this.currentPeriod].doRequest) {
      this.data[this.currentPeriod].doRequest = true;
      this.apiService.getCurrencyPairValuesHistoryFromRawUrl(this.data[this.currentPeriod].next)
        .then((res) => {
          this.data[this.currentPeriod].next = res.next;

          res.results.forEach((elem) => {this.data[this.currentPeriod].results.push(elem)});
          this.normalizeDate(this.data[this.currentPeriod].results);

          let data = this.data[this.currentPeriod].results;
          this.sortData(data);

          this.chartSettings.calculateBounds(data);
          this.chartSettings.recalculateYAxis(data);
          this.chartSettings.updateYScaleDomain();
          this.chartSettings.redrawChart();

          this.data[this.currentPeriod].doRequest = false;
        });
    }
  }

  normalizeDate(data) {
    data.forEach(function (value) {
      value.date = new Date(value.creation_time).getTime();
    });
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
  public yScale;
  public xScale;

  private _onZoomHandlers = [];

  onZoom(fn) {
    this._onZoomHandlers.push(fn);
  }

  redrawOnNewData(data) {
    this.calculateBounds(data);
    this.updateXScaleDomain();
    this.updateDataSeries(data);

    let daysShown = (data.length >= 20 ? 20 : data.length) - 1;
    this.xScale.domain([
      data[data.length - daysShown - 1].date,
      data[data.length - 1].date
    ]);
    this.recalculateYAxis(data);
    this.updateYScaleDomain();

    this.redrawChart();
    this.updateZoomFromChart();
  }

  calculateBounds(data) {
    this.minDate = d3.min(data, function (d) { return d.date; });
    this.maxDate = d3.max(data, function (d) { return d.date; });
    this.yMin = d3.min(data, function (d) { return d.low; });
    this.yMax = d3.max(data, function (d) { return d.high; });
  };

  recalculateYAxis(data) {
    let minDomain = this.xScale.domain()[0],
      maxDomain = this.xScale.domain()[1],
      difference = maxDomain - minDomain;

    if (maxDomain > this.maxDate) {
      maxDomain = this.maxDate;
      minDomain = maxDomain - difference;
    }
    if (minDomain < this.minDate) {
      minDomain = this.minDate;
      maxDomain = minDomain + difference;
    }

    let matterData = data.filter((elem) => {
      return elem.date >= minDomain && elem.date <= maxDomain;
    });

    this.yMin = d3.min(matterData, function (d) { return d.low; });
    this.yMax = d3.max(matterData, function (d) { return d.high; });
  }

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

  updateXScaleDomain() {
    this.xScale.domain([this.minDate, this.maxDate]);
  }

  updateYScaleDomain() {
    this.yScale.domain([this.yMin, this.yMax]).nice();
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

  updateDataSeries(data) {
    this.series = CandlesTickChartSettings.createCandlesTickSeries()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.dataSeries
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
    this.zoom = d3.behavior.zoom()
      .x(this.xScale)
      .on('zoom', () => {
        this._onZoomHandlers.forEach(fn => fn());

        if (this.xScale.domain()[0] < this.minDate) {
          this.zoom.translate([this.zoom.translate()[0] - this.xScale(this.minDate) + this.xScale.range()[0], 0]);
        } else if (this.xScale.domain()[1] > this.maxDate) {
          this.zoom.translate([this.zoom.translate()[0] - this.xScale(this.maxDate) + this.xScale.range()[1], 0]);
        }
        this.redrawChart();
      });

    let overlay = d3.svg.area()
      .x((d) => this.xScale(d.date))
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
    this.plotChart.select('.y.axis').call(this.yAxis);
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

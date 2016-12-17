import { Component, OnInit, ElementRef } from '@angular/core';
import {HistoryValuesConstsService} from "../../services/historyValuesConsts.service";
import {ApiService} from "../../services/api.service";

declare var jQuery: any;
declare var d3: any;
declare var nv: any;

@Component({
  selector: '[candlestick-chart]',
  templateUrl: './candlestick-chart.template.html'
})
export class CandlesTickChart implements OnInit {
  $el: any;
  private chart: any;
  private data;

  constructor(el: ElementRef,
              private historyValuesConsts: HistoryValuesConstsService,
              private apiService: ApiService) {
    this.$el = jQuery(el.nativeElement);
  }

  ngOnInit(): void {
    let self = this;
    this.apiService.getCurrencyPairValuesHistory(1, this.historyValuesConsts.PERIOD_5_MINUTES)
      .then(function (res) {
        console.log(res);
        self.data = res.results;
        self.data.forEach(function (value) {
          value.date = new Date(value.creation_time).getTime();
        });
        self.data.sort(function (a, b) {
          if (a.date < b.date)
            return -1;
          if (a.date > b.date)
            return 1;
          return 0;
        });
        self.initCandlestickChart();
      });
  }

  initCandlestickChart(): any {
    let data = this.data;

    var minDate = d3.min(data, function (d) { return d.date; });
    var maxDate = d3.max(data, function (d) { return d.date; });
    var yMin = d3.min(data, function (d) { return d.low; });
    var yMax = d3.max(data, function (d) { return d.high; });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // The primary chart

    // Set up the drawing area

    var margin = {top: 20, right: 20, bottom: 30, left: 35},
        width = 660 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var plotChart = d3.select('#candlestick-chart').classed('chart', true).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var plotArea = plotChart.append('g')
        .attr('clip-path', 'url(#plotAreaClip)');

    plotArea.append('clipPath')
        .attr('id', 'plotAreaClip')
        .append('rect')
        .attr({ width: width, height: height });

    // Scales

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    // Set scale domains
    xScale.domain([minDate, maxDate]);
    yScale.domain([yMin, yMax]).nice();

    // Set scale ranges
    xScale.range([0, width]);
    yScale.range([height, 0]);

    // Axes

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    plotChart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    plotChart.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // Data series
    var series = this.candlestickChart()
        .xScale(xScale)
        .yScale(yScale);

    var dataSeries = plotArea.append('g')
        .attr('class', 'series')
        .datum(data)
        .call(series);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Zooming and panning

    var zoom = d3.behavior.zoom()
        .x(xScale)
        .on('zoom', function() {
            if (xScale.domain()[0] < minDate) {
                zoom.translate([zoom.translate()[0] - xScale(minDate) + xScale.range()[0], 0]);
            } else if (xScale.domain()[1] > maxDate) {
                zoom.translate([zoom.translate()[0] - xScale(maxDate) + xScale.range()[1], 0]);
            }
            redrawChart();
        });

    var overlay = d3.svg.area()
        .x(function (d) { return xScale(d.date); })
        .y0(0)
        .y1(height);

    plotArea.append('path')
        .attr('class', 'overlay')
        .attr('d', overlay(data))
      	.call(zoom);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Setup

    var daysShown = 10;

    xScale.domain([
      data[data.length - daysShown - 1].date,
      data[data.length - 1].date
    ]);

    redrawChart();
    updateZoomFromChart();

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helper methods

    function redrawChart() {
        dataSeries.call(series);
        plotChart.select('.x.axis').call(xAxis);
    }

    function updateZoomFromChart() {
        var fullDomain = maxDate - minDate,
          currentDomain = xScale.domain()[1] - xScale.domain()[0];
        var minScale = currentDomain / fullDomain,
          maxScale = minScale * 20;
        zoom.x(xScale)
          .scaleExtent([minScale, maxScale]);
    }

  }

  candlestickChart() {
        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var isUpDay = function(d) {
            return d.close > d.open;
        };

        var isDownDay = function (d) {
            return !isUpDay(d);
        };

        var line = d3.svg.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });

        var highLowLines = function (bars) {

            var paths = bars.selectAll('.high-low-line').data(function (d) {
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

        var rectangles = function (bars) {
            var rect,
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

        var candlestick = function (selection) {
            var series, bars;

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
    };

}

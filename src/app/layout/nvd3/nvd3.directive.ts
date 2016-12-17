import {Directive, ElementRef, Input} from '@angular/core';
import {tick} from "@angular/core/testing";
declare var jQuery: any;
declare var nv: any;
declare var d3: any;

@Directive({
  selector: '[nvd3-chart]'
})

export class Nvd3Chart {
  $el: any;
  @Input() chart: any;
  @Input() height: string;
  @Input() datum: any;

  chartData;

  constructor(el: ElementRef) {
    this.$el = jQuery(el.nativeElement);
  }

  render(): void {

    nv.addGraph(() => {
      let chart = this.chart;

      this.chartData = d3.select(this.$el.find('svg')[0])
        .style('height', this.height || '300px')
        .datum(this.datum);

      this.chartData.transition().duration(500)
        .call(chart);

      jQuery(window).on('sn:resize', chart.update);

      return chart;
    });
  }

  ngOnInit(): void {
    this.render();

    setInterval(() => {

      this.chartData.datum(this.datum).transition().duration(500).call(this.chart);

      if(this.datum[0].values.length > 50) {
        this.datum[0].values.shift();
      }
    }, 1000)
  }
}

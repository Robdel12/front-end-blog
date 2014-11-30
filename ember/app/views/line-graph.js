import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['chart'],
  chart: BarChart()
    .margin({left: 40, top: 40, bottom: 80, right: 40})
    .oneColor('#BE3600')
    .rotateAxisLabels(true),
  didInsertElement: function() {
    Ember.run.once(this, 'updateChart');
  },
  updateChart: function() {
    if (this.get('isLoaded')) {
      d3.select(this.$()[0]).data([ this.get('data') ]).call(this.get('chart'));
    }
  }.observes('data')
});

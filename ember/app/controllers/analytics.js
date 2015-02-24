import Ember from 'ember';

export default Ember.Controller.extend({
  loadingData: true,
  graphStartDate: moment().subtract(1, 'weeks').startOf('isoWeek').format("YYYY-MM-DD"),
  graphEndDate: moment().format("YYYY-MM-DD"),
  maxDate: moment().toDate(),
  queryParams: ['graphStartDate', 'graphEndDate'],

  minValue: Ember.computed.min('pageviews'),
  maxValue: Ember.computed.max('pageviews'),

  axis: {
    x: {
      type: 'timeseries',
      tick: {
        format: "%b %d, %Y"
      }
    }
  },

  pageviews: function() {
    var columns = this.get('graphData.columns');

    if (columns) {
      var pageviews = columns[1];
      return pageviews.slice(1);
    } else {
      return [0];
    }
  }.property('graphData'),

  analytics: function() {
    var startDate = this.get("graphStartDate");
    var endDate = this.get("graphEndDate");

    return this.store.find('analytic', { startDate: startDate, endDate: endDate });
  }.property('store', 'graphStartDate', 'graphEndDate'),

  graphData: function() {
    var model = this.get('analytics.firstObject');

    if (model) {
      this.set("loadingData", false);

      return {
        x: "date",
        columns: [
          model.get('date'),
          model.get('pageview')
        ],
        type: "bar"
      };
    }
  }.property('analytics.firstObject')
});

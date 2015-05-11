import Ember from 'ember';

export default Ember.Controller.extend({
  loadingData: true,
  graphStartDate: moment().subtract(1, 'weeks').startOf('isoWeek').format("YYYY-MM-DD"),
  graphEndDate: moment().format("YYYY-MM-DD"),
  pickerMaxDate: moment().toDate(),
  queryParams: ['graphStartDate', 'graphEndDate'],

  minPageview: Ember.computed.min('pageviewArray'),
  maxPageview: Ember.computed.max('pageviewArray'),

  axis: {
    x: {
      type: 'timeseries',
      tick: {
        format: "%b %d, %Y"
      }
    }
  },

  minDate: function() {
    return this.dateCalculator(this.get("minPageview"));
  }.property("minPageview"),

  maxDate: function() {
    return this.dateCalculator(this.get("maxPageview"));
  }.property("maxPageview"),

  dateCalculator: function(date) {
    var pageviews = this.get("analytics.firstObject.pageview");
    if(!pageviews) { return false; }
    var dates = this.get("analytics.firstObject.date");
    var pageviewIndex = pageviews.indexOf(date);

    return moment(dates[pageviewIndex]).format("MMMM Do, YYYY");
  },

  pageviewArray: function() {
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

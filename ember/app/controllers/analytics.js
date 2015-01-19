import Ember from 'ember';

export default Ember.Controller.extend({
  controllerData: null,
  loadingData: false,
  graphStartDate: moment().subtract(1, 'weeks').startOf('isoWeek').format("YYYY-MM-DD"),
  graphEndDate: moment().format("YYYY-MM-DD"),
  maxDate: moment().toDate(),

  axis: {
    x: {
      type: 'timeseries',
      tick: {
        format: "%b %d, %Y"
      }
    }
  },

  setDateAndData: function(startDate, endDate) {
    var graphData;
    var self = this;
    startDate = this.get("graphStartDate") || startDate;
    endDate = this.get("graphEndDate") || endDate;

    this.set("loadingData", true);

    return Ember.$.getJSON('http://localhost:3000/api/analytics?startDate=' + startDate + '&endDate=' + endDate).then(function(data) {
      graphData = data.analytics;
      self.set("loadingData", false);

      return self.set("controllerData", {
        x: "date",
        columns: graphData,
        type: "bar"
      });
    });
  }.on("init"),

  actions: {
    updateData: function() {
      this.setDateAndData(this.get("startDate"), this.get("endDate"));
    }
  }
});

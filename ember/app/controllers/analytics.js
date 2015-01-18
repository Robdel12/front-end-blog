import Ember from 'ember';

export default Ember.Controller.extend({
  controllerData: null,
  loadingData: false,
  startDate: moment().subtract(1, 'weeks').startOf('isoWeek').format("YYYY-MM-DD"),
  endDate: moment().format("YYYY-MM-DD"),

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
    startDate = this.get("startDate") || startDate;
    endDate = this.get("endDate") || endDate;

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

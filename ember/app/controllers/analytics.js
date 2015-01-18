import Ember from 'ember';

export default Ember.Controller.extend({
  controllerData: null,
  startDate: "2015-01-01",
  endDate: "2015-01-15",

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

    return Ember.$.getJSON('http://localhost:3000/api/analytics?startDate=' + startDate + '&endDate=' + endDate).then(function(data) {
      graphData = data.analytics;
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

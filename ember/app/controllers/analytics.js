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
    startDate = this.get("graphStartDate") || startDate;
    endDate = this.get("graphEndDate") || endDate;
    var self = this;

    this.set("loadingData", true);

    return this.store.find('analytic', { startDate: startDate, endDate: endDate }).then(function(data) {
      var graphData = data.content[0]._data;
      self.set("loadingData", false);

      return self.set("controllerData", {
        x: "date",
        columns: [
          graphData.date,
          graphData.pageview
        ],
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

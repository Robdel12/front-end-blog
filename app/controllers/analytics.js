import Ember from 'ember';

export default Ember.Controller.extend({
  controllerData: null,
  loadingData: false,
  graphStartDate: Ember.computed(function() {
    return moment().subtract(1, 'weeks').startOf('isoWeek').format("YYYY-MM-DD");
  }),
  graphEndDate: Ember.computed(function() {
    return moment().format("YYYY-MM-DD");
  }),
  maxDate: moment().toDate(),

  axis: {
    x: {
      type: 'timeseries',
      tick: {
        format: "%b %d, %Y"
      }
    }
  },

  setDateAndData: Ember.on('init', function(startDate, endDate) {
    let newStartDate = this.get("graphStartDate") || startDate;
    let newEndDate = this.get("graphEndDate") || endDate;

    this.set("loadingData", true);

    return this.store.query('analytic', { "startDate": newStartDate, "endDate": newEndDate }).then((data) => {
      let graphData = data.content[0]._data;
      this.set("loadingData", false);

      return this.set("controllerData", {
        x: "date",
        columns: [
          graphData.date,
          graphData.pageview
        ],
        type: "bar"
      });
    }).catch(() => {
      this.set("loadingData", false);
      this.get('flashMessages').danger('Uh oh! There was an error!');
    });

  }),

  actions: {
    updateData: function() {
      this.setDateAndData(this.get('graphStartDate'), this.get('graphEndDate'));
    }
  }
});

import Ember from "ember";
import PagedRemoteArray from 'ember-cli-pagination/remote/paged-remote-array';

export default Ember.Route.extend({

  model: function(params) {
    return PagedRemoteArray.create({modelName: 'post', store: this.store, page: params.page || 1, perPage: params.per_page || 10});
  }

});

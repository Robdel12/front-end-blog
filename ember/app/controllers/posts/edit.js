import Ember from "ember";

var EditController = Ember.ObjectController.extend({
  published: [false, true],
  selectedState: null,

  destroy: function() {
    this.store.find('posts', this.content.id).then(function (post) {
      post.destroyRecord();
    });
    return this.transitionTo('dashboard');
  },

  save: function() {
    return this.model.save().then((function(_this) {
      return function() {
        if(_this.model._data.is_published === true){
          debugger;
          return _this.transitionToRoute('posts.show', _this.model);
        }
      };
    })(this));
  },

  cancel: function() {
    if (this.content.isDirty) {
      this.content.rollback();
    }
    return this.transitionTo('posts.show', this.content);
  },

  buttonTitle: 'Edit',
  headerTitle: 'Editing'
});

export default EditController;

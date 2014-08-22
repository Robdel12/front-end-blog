import Ember from "ember";

var EditController = Ember.ObjectController.extend({
  destroy: function() {
    this.store.find('posts', this.content.id).then(function (post) {
      post.destroyRecord();
    });
    return this.transitionTo('dashboard');
  },

  save: function() {
    return this.content.save().then((function(_this) {
      return function() {
        return _this.transitionToRoute('posts.show', _this.content);
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

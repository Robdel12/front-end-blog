import Ember from 'ember';

var CreateController = Ember.ObjectController.extend({

  init: function() {
    this.set('post',  Ember.Object.create());
  },

  actions: {

    publishPost: function() {

      var newPost = this.store.createRecord('post', {
        title: this.get('post.title'),
        excerpt: this.get('post.excerpt'),
        body: this.get('post.body'),
        published: new Date().getTime(),
        post_slug: this.get("post.title").replace(/\s+$/g,'').replace(/\s+/g, '-').toLowerCase()
      });

      newPost.save();

      this.setProperties({
        'post.title': '',
        'post.excerpt': '',
        'post.body': ''
      });
      this.transitionToRoute('posts'); // Do I want this, or the post that was just made?
    }
  }

});

export default CreateController;

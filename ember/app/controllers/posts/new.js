import Ember from "ember";

var NewController = Ember.ObjectController.extend({
  published: [false, true],
  selectedState: null,

  init: function() {
    this.set("post",  Ember.Object.create());
  },

  actions: {
    savePost: function() {
      var postData = {
            title: this.get("post.title"),
            excerpt: this.get("post.excerpt"),
            body: this.get("post.body"),
            post_slug: this.get("post.title").replace(/\s+$/g,'').replace(/\s+/g, '-').toLowerCase(),
            is_published: this.get("selectedState")
          },
          newPost;

      newPost = this.store.createRecord("post", postData);
      newPost.save();
      this.setProperties({
        "post.title": "",
        "post.excerpt": "",
        "post.body": ""
      });
      if(postData.is_published === true){
        this.transitionToRoute("posts.show", postData.post_slug);
      } else {
        this.transitionToRoute("posts.edit", postData.post_slug);
      }
    }
  }

});

export default NewController;

/* jshint expr:true */
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

describe('Acceptance: Add Post', function() {
  var application, pretender;

  beforeEach(function() {
    application = startApp();
    pretender = new Pretender();
  });

  afterEach(function() {
    Ember.run(application, 'destroy');
    pretender.shutdown();
  });

  describe('visiting posts/new unauthenticated', function() {
    beforeEach(function() {
      invalidateSession();
      return visit('/posts/new');
    });

    it('redirects to login page', function() {
      expect(currentPath()).to.equal('login');
    });
  });

  describe('visiting posts/new authenticated', function() {
    beforeEach(function() {
      authenticateSession();
      return visit('/posts/new');
    });

    it('lets you get to posts/new', function() {
      expect(currentPath()).to.equal('posts.new');
    });
  });

  describe('creating a new post post', function() {
    beforeEach(function() {
      pretender.post('api/posts', function() {
        return [201, { 'Content-Type': 'application/json' }, "{}"];
      });

      authenticateSession();
      visit('/posts/new');
      fillIn('#post_title', 'Post Title');
      click('.more-options');
      fillIn('#excerpt', 'Post excerpt');
      fillIn('.post-text-area', 'This is the post body.. Deal wit it');
      click('.spec-publish-toggle');
      return click('.spec-save-post');
    });

    it('redirects to published page', function() {
      expect(currentPath()).to.equal('posts.show');
    });

    it('has the correct title', function() {
      expect($('.post-title').text().trim()).to.equal('Post Title');
    });

    it.skip('has the correct post date', function() {
      expect($('.spec-formatted-date').text().trim()).to.equal('June 1st 2015, 12:00 am');
    });

    it('has the correct body text', function() {
      expect($('.spec-post-body').text().trim()).to.equal('This is the post body.. Deal wit it');
    });
  });

});

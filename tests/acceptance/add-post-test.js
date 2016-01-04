/* jshint expr:true */
import { describe, it, beforeEach, afterEach } from 'mocha';
import { openDatepicker } from 'ember-pikaday/helpers/pikaday';
import { expect } from 'chai';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import { authenticateSession, invalidateSession } from 'front-end/tests/helpers/ember-simple-auth';

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
      invalidateSession(application);
      return visit('/posts/new');
    });

    it('redirects to login page', function() {
      expect(currentPath()).to.equal('login');
    });
  });

  describe('visiting posts/new authenticated', function() {
    beforeEach(function() {
      authenticateSession(application);
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

      authenticateSession(application);
      visit('/posts/new');
      fillIn('#post_title', 'Post Title');
      return click('.more-options');
    });
    beforeEach(function() {
      let datePicker;
      fillIn('#excerpt', 'Post excerpt');
      datePicker = openDatepicker(Ember.$('.spec-publish-date'));
      datePicker.selectDate(new Date(2015, 2, 3));
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

    if (!window.navigator.userAgent.match(/Phantom/i)) {
      it('has the correct post date', function() {
        expect($('.spec-formatted-date').text().trim()).to.equal('March 3rd 2015, 12:00 am');
      });
    }

    it('has the correct body text', function() {
      expect($('.spec-post-body').text().trim()).to.equal('This is the post body.. Deal wit it');
    });
  });

});

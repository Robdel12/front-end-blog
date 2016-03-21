/* jshint expr:true */
import { describe, it, beforeEach, afterEach } from 'mocha';
import { openDatepicker } from 'ember-pikaday/helpers/pikaday';
import { expect } from 'chai';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import { authenticateSession, invalidateSession } from 'front-end/tests/helpers/ember-simple-auth';

describe('Acceptance: Add Post', function() {
  var application;

  beforeEach(function() {
    application = startApp();
  });

  afterEach(function() {
    Ember.run(application, 'destroy');
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
      authenticateSession(application);
      visit('/posts/new');
      fillIn('#post_title', 'Post Title');
      return click('.more-options');
    });
    beforeEach(function() {
      let datePicker;
      return fillIn('#excerpt', 'Post excerpt');
      // datePicker = openDatepicker(Ember.$('.spec-publish-date'));
      // return datePicker.selectDate(new Date(2015, 2, 3));
    });
    beforeEach(function() {
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

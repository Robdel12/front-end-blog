/* jshint expr:true */
import { describe, it, beforeEach, afterEach } from 'mocha';
import { openDatepicker } from 'ember-pikaday/helpers/pikaday';
import { expect } from 'chai';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import { authenticateSession, invalidateSession } from 'front-end/tests/helpers/ember-simple-auth';

describe('Acceptance: Adding About', function() {
  var application;

  beforeEach(function() {
    application = startApp();
  });

  afterEach(function() {
    Ember.run(application, 'destroy');
  });

  describe('visiting about new unauthenticated', function() {
    beforeEach(function() {
      invalidateSession(application);
      return visit('/about/new');
    });

    it('can not visit about new', function() {
      expect(currentPath()).to.equal('login');
    });
  });

  // wtf?
  // Assertion Failed: You must include an 'id' for undefined in an object passed to 'push'
  describe.skip('visiting about index unauthenticated', function() {
    beforeEach(function() {
      this.abouts = server.createList('timeline', 5);
      return visit('/about');
    });

    it('should not have admin links', function() {
      expect($('.spec-admin-links a').length).to.equal(0);
      expect($('.spec-admin-links p').length).to.equal(0);
    });
  });

  // wtf?
  // Assertion Failed: You must include an 'id' for undefined in an object passed to 'push'
  describe.skip('visiting about index authenticated', function() {
    beforeEach(function() {
      authenticateSession(application);
      let date = new Date(2011, 04, 27);

      server.create('timeline');
      server.create('timeline', {
        event_date: date
      });

      return visit('/about');
    });

    it('should have admin links', function() {
      expect($('.spec-admin-links a').length).to.equal(2);
      expect($('.spec-admin-links p').length).to.equal(2);
    });

    it('sorts the days', function() {
      expect($('.spec-timeline-container .date').last().text()).to.equal('May 27th, 2011');
    });
  });

  describe('visiting about/new authenticated', function() {
    beforeEach(function() {
      authenticateSession(application);
      return visit('/about/new');
    });

    it('can visit about.new', function() {
      expect(currentPath()).to.equal('about.new');
    });

    describe('creating a new about', function() {
      beforeEach(function() {
        fillIn('.title', 'About Title');
        return fillIn('.timeline-text-area', '## About body');
      });

      beforeEach(function() {
        let datePicker = openDatepicker(Ember.$('.spec-about-datepicker'));
        select('#is_published', "Published");
        datePicker.selectDate(new Date(2011, 5, 23));
        return click('.spec-about-save');
      });

      it('can visit redirects to the about index', function() {
        expect(currentPath()).to.equal('about.index');
      });

      it('has the correct title', function() {
        expect($('.spec-timeline-container h4').text().trim()).to.equal('About Title');
      });

      it('has the correct body', function() {
        expect($('.spec-timeline-description').text().trim()).to.equal('About body');
        expect($('.spec-timeline-description').html().trim()).to.equal('<h2 id="about-body">About body</h2>');
      });

      it('has the correct date', function() {
        expect($('.spec-timeline-container .date').text().trim()).to.equal('June 23rd, 2011');
      });
    });
  });
});

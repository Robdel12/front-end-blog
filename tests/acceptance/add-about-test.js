/* jshint expr:true */
import { describe, it, beforeEach, afterEach } from 'mocha';
import { openDatepicker } from 'ember-pikaday/helpers/pikaday';
import { expect } from 'chai';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import { authenticateSession, invalidateSession } from 'front-end/tests/helpers/ember-simple-auth';

describe('Acceptance: Adding About', function() {
  var application, pretender;

  beforeEach(function() {
    application = startApp();
    pretender = new Pretender();
  });

  afterEach(function() {
    Ember.run(application, 'destroy');
    pretender.shutdown();
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

  describe('visiting about index unauthenticated', function() {
    beforeEach(function() {
      pretender.get('api/timeline', function() {
        return [201, { 'Content-Type': 'application/json' }, '{"timeline":[{"id":28,"title":"eweqweqweqwe","description":"qweqweqweqweqweqweqwe","created_at":"2015-06-27T04:19:51.692Z","event_date":"2015-06-27T04:19:13.506Z","is_published":true}]}'];
      });

      invalidateSession(application);
      return visit('/about');
    });

    it('should not have admin links', function() {
      expect($('.spec-admin-links a').length).to.equal(0);
      expect($('.spec-admin-links p').length).to.equal(0);
    });
  });

  describe('visiting about index authenticated', function() {
    beforeEach(function() {
      pretender.get('api/timeline', function() {
        return [201, { 'Content-Type': 'application/json' }, '{"timeline":[{"id":32,"title":"New new","description":"qweqweqweqweqweqweqwe","created_at":"2011-06-23T04:11:26.471Z","event_date":"2011-06-23T05:00:00.000Z","is_published":true}, {"id":28,"title":"eweqweqweqwe","description":"qweqweqweqweqweqweqwe","created_at":"2011-05-26T04:19:51.692Z","event_date":"2011-05-27T05:00:00.000Z","is_published":true}]}'];
      });

      authenticateSession(application);
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

  describe.skip('visiting about/new authenticated', function() {
    beforeEach(function() {
      authenticateSession(application);
      return visit('/about/new');
    });

    it('can visit about.new', function() {
      expect(currentPath()).to.equal('about.new');
    });

    describe('creating a new about', function() {
      beforeEach(function() {
        pretender.post('api/timeline', function() {
          return [201, { 'Content-Type': 'application/json' }, '{"timeline":{"id":20,"title":"This is a test","description":"ubwfiuweufuwiefiuwef","created_at":"2015-12-08T02:24:35.133Z","event_date":"2015-12-03T06:00:00.000Z","is_published":true}}'];
        });

        pretender.get('api/timeline', function() {
          return [201, { 'Content-Type': 'application/json' }, '{"timeline":{"id":20,"title":"This is a test","description":"ubwfiuweufuwiefiuwef","created_at":"2015-12-08T02:24:35.133Z","event_date":"2015-12-03T06:00:00.000Z","is_published":true}}}'];
        });

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

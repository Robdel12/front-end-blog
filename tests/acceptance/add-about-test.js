/* jshint expr:true */
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

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
      invalidateSession();
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

      invalidateSession();
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
        return [201, { 'Content-Type': 'application/json' }, '{"timeline":[{"id":28,"title":"eweqweqweqwe","description":"qweqweqweqweqweqweqwe","created_at":"2015-06-27T04:19:51.692Z","event_date":"2015-06-27T04:19:13.506Z","is_published":true}]}'];
      });

      authenticateSession();
      return visit('/about');
    });

    it('should have admin links', function() {
      expect($('.spec-admin-links a').length).to.equal(1);
      expect($('.spec-admin-links p').length).to.equal(1);
    });
  });

  describe('visiting about/new authenticated', function() {
    beforeEach(function() {
      authenticateSession();
      return visit('/about/new');
    });

    it('can visit about.new', function() {
      expect(currentPath()).to.equal('about.new');
    });

    describe('creating a new about', function() {
      beforeEach(function() {
        pretender.post('api/timeline', function() {
          return [201, { 'Content-Type': 'application/json' }, "{}"];
        });

        pretender.get('api/timeline', function() {
          return [201, { 'Content-Type': 'application/json' }, "{}"];
        });

        fillIn('.title', 'About Title');
        fillIn('.timeline-text-area', 'About body');
        select('#is_published', "Published");
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
      });

      it.skip('has the correct date', function() {
        expect(currentPath()).to.equal('about.index');
      });
    });
  });
});

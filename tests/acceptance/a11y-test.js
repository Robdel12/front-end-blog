/* jshint expr:true */
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

describe.only('Acceptance: A11y', function() {
  var application, pretender;

  beforeEach(function() {
    application = startApp();
    pretender = new Pretender();
  });

  afterEach(function() {
    Ember.run(application, 'destroy');
    pretender.shutdown();
  });

  describe("visitng /posts.index", function() {
    beforeEach(function() {
      pretender.get('api/posts', function() {
        return [201, { 'Content-Type': 'application/json' }, '{"posts":[{"id":19,"title":"wqeqweqweqwe","body":"qweqweqweqwe","created_at":"2015-06-26T20:44:35.999Z","post_slug":"wqeqweqweqwe","excerpt":"hello fucking world","published_date":"2015-06-26T20:44:35.999Z","is_published":true}],"meta":{"total_pages":0}}'];
      });
      return visit('/posts');
    });

    it("is accessible", function() {
      a11yTest();
    });
  });

  describe("visitng /posts.show", function() {
    beforeEach(function() {
      pretender.get('api/posts/19', function() {
        return [201, { 'Content-Type': 'application/json' }, '{"posts":{"id":19,"title":"wqeqweqweqwe","body":"qweqweqweqwe","created_at":"2015-06-26T20:44:35.999Z","post_slug":"wqeqweqweqwe","excerpt":null,"published_date":"2015-06-26T20:44:35.999Z","is_published":true}}'];
      });
      return visit('/posts/19');
    });

    it("is accessible", function() {
      debugger;
      a11yTest();
    });
  });
});

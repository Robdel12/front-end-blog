/* jshint expr:true */
import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

describe('Acceptance: Make Contact Request', function() {
  var application, pretender;

  beforeEach(function() {
    application = startApp();
    pretender = new Pretender();
  });

  afterEach(function() {
    Ember.run(application, 'destroy');
    pretender.shutdown();
  });

  describe('filling out the contact form with valid data', function() {
    beforeEach(function() {
      pretender.post('api/contacts', function() {
        return [201, { 'Content-Type': 'application/json' }, "{}"];
      });

      visit('/contact');
      fillIn('#name', 'Namerson');
      fillIn('#email', 'namerson@mail.com');
      fillIn('#reason_for_contact', 'This is the reason for contact');
      fillIn('.post-text-area', 'Here are my comments. Hire you.');
      return click('.btn:contains("Send me an email!")');
    });

    it('has a confirmation modal', function() {
      expect($('.thank-you').hasClass('show')).to.be.true;
    });

    it('has a confirmation modal with correct information', function() {
      expect($('.thank-you h1').text().trim()).to.equal('Thank you!');
      expect($('.thank-you p').text().trim()).to.equal('Your email has been sent. I should be in contact shortly :)');
    });

    describe('dismissing the modal', function() {
      beforeEach(function() {
        return click('.modal-btn');
      });

      it('should close the modal', function() {
        expect($('.thank-you').hasClass('modal-closed')).to.be.true;
      });
    });
  });


  if (!window.navigator.userAgent.match(/Phantom/i)) {
    describe('filling out the contact form with missing fields', function() {
      beforeEach(function() {
        pretender.post('api/contacts', function() {
          return [201, { 'Content-Type': 'application/json' }, "{}"];
        });

        visit('/contact');
        fillIn('#name', 'Namerson');
        fillIn('#reason_for_contact', 'This is the reason for contact');
        fillIn('.post-text-area', 'Here are my comments. Hire you.');
        click('.btn:contains("Send me an email!")');
        return wait();
      });

      it('shouldnt submit the form', function() {
        expect($('.thank-you').hasClass('modal-closed')).to.be.true;
      });
    });
  }
});

import Ember from 'ember';
import registerA11yHelpers from './a11y/register-a11y-helpers';
import Application from '../../app';
import config from '../../config/environment';

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    registerA11yHelpers();
    application.injectTestHelpers();
  });

  return application;
}

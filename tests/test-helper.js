import resolver from './helpers/resolver';
import registerSelectHelper from './helpers/register-select-helper';
import { setResolver } from 'ember-mocha';

registerSelectHelper();
setResolver(resolver);

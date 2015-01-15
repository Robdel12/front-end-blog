import flashMessagesService from 'front-end/services/flash-service';

export default {
  name: 'flash-messages',
  initialize: function(container, application){
    application.register('service:flash-messages', flashMessagesService, { singleton: true });
    application.inject('controller', 'flashes', 'service:flash-messages');
  }
};

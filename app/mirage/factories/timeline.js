/*
 This is an example factory definition.

 Create more files in this directory to define additional factories.
 */
import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  title() { return faker.lorem.sentence(); },
  description() { return faker.lorem.sentences(); },
  eventDate() { return faker.date.recent(); },
  createdAt() { return faker.date.recent(); },
  isPublished() { return faker.random.boolean(); }
});

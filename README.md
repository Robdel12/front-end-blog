Robert's Ember Blog
====

Ember front end and rails back end.

### TODO
- [ ] Update readme to something better than this!
- [x] proper github markdown rendering
- [ ] Store posts in local storage on first page load
- [ ] Redesign site. Your CSS is disgusting, son.
- [ ] Make the portfolio section dynamic and tied into rails
- [ ] Upload assets to s3 automatically.
- [x] dashboard pulling in google analytics API with d3 graphs


# Installation
Fork the project, then:
- `git clone`

Dependencies (if you don't have these installed):
- npm `brew install npm`
- Bower (`npm install bower`)
- Ember CLI (`npm install -g ember-cli`)

Setting up the backend:
- `bundle install`
- `bundle exec rake db:setup`

Setting up the front end:
- `cd ember`
- `npm install`
- `bower install`

## Running the servers
In rails/, run `bundle exec rails s` or `rails s`
In ember/, run `ember server`

Robert's Ember Blog [![Build Status](https://travis-ci.org/Robdel12/front-end-blog.svg?branch=master)](https://travis-ci.org/Robdel12/front-end-blog)
====

Ember front end and rails back end.

### Future TODOs:
- [ ] Store posts in localSession on first page load
- [ ] Make the portfolio section dynamic. Or remove it? Don't have much to show
anymore.
- [ ] Upload assets to s3 automatically.
- [ ] Create separate layout for admin

# Road to 0.1.0
- [ ] Upgrade to ember 2.0
  - [ ] Remove all deprecations
- [ ] Improve creating a blog post flow
- [ ] Fix analytics page
- [ ] Merge PR #34
  - [ ] Write tests
- [ ] Write a solid test suite
- [ ] Fix admin bar with dropdown
- [ ] Use ember best practices


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

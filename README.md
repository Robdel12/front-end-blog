Ember Blog
====

Ember front end and rails backend. This will eventually replace my wordpress blog I have.


### Website todos
- [x] root route = posts
- [x] hitting the create page = login page if not logged in.
- [ ] be able to save drafts
- [ ] publish and in publish posts
- [x] only show posts that are published
- [x] create dashboard that shows all posts
- [x] delete posts
- [x] edit posts
- [x] update routes:
  - posts/:id/edit
  - posts/new
- [ ] SEO fields on the post like the wordpress SEO. (I think taking the excerpt and title would be enough)

### Nice haves:
- [ ] dashboard showing all posts (published, draft, unpublished).
- [ ] dashboard pulling in google analytics API with d3 graphs

### Installation
Fork the project, then:
- `git clone`

In rails/
Run:
- `bundle install`
- `bundle exec rake db:setup`

In ember/
Dependencies:
- npm `brew install npm`
- Bower (`npm install bower`)
- Ember CLI (`npm install -g ember-cli`)

Run:
- `npm install`
- `bower install`

## Running the servers
In rails/, run `bundle exec rails s`
In ember/, run `ember server --proxy http://localhost:3000`

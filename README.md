Ember Blog
====

Ember front end and rails backend. This will eventually replace my wordpress blog I have.


### Website todos to go live
- [ ] replace all images with s3 hosted images
- [ ] pageinate posts
- [ ] can we minify new relic scripts? Come on man...
- [ ] proper github markdown rendering
- [ ] bring over last few posts
- [ ] handle errors better when creating blog posts. (Don't just break the page..)
- [ ] change up the posts new view. It's not deal for writing posts.
- [x] auto save draft function. (went with 2mins)
- [ ] loading animations everywhere
- [x] dashboard ordering needs to be updated
- [x] needs 404 page
- [x] Import old posts
- [x] clean up CSS a little && make responsive
- [x] Add portfolio section
- [x] root route = posts
- [x] hitting the create page = login page if not logged in.
- [x] be able to save drafts
- [x] publish and unpublish posts
- [x] Remove "login" logic from views
- [x] only show posts that are published
- [x] create dashboard that shows all posts
- [x] delete posts
- [x] edit posts
- [x] update routes:
  - posts/:id/edit
  - posts/new

### Nice haves:
- [ ] Redesign site. Your CSS is disgusting, son.
- [ ] Make the timeline dynamic & tied into rails.
- [ ] Make the portfolio section dynamic and tied into rails
- [ ] Upload assets to s3 automatically.
- [ ] dashboard pulling in google analytics API with d3 graphs
- [x] dashboard showing all posts (published, draft, unpublished).

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
In rails/, run `bundle exec rails s`
In ember/, run `ember server --proxy http://localhost:3000`

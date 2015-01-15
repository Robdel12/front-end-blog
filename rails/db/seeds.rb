# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

case Rails.env
when "development"
   Posts.create(
    title: "Title 1",
    post_slug: "title-1",
    created_at: Time.now - 4.days,
    excerpt: Faker::Lorem.sentences(1)[0],
    body: Faker::Lorem.paragraphs(15)[0]
  )

  Posts.create(
    title: "Title 2",
    post_slug: "title-2",
    created_at: Time.now - 2.days,
    excerpt: Faker::Lorem.sentences(1)[0],
    body: Faker::Lorem.paragraphs(15)[0]
  )

  Posts.create(
    title: "Title 3",
    post_slug: "title-3",
    created_at: Time.now,
    excerpt: Faker::Lorem.sentences(1)[0],
    body: Faker::Lorem.paragraphs(15)[0]
  )

  User.create([
    {
      email: 'robert@mail.com',
      password: '12345678',
      password_confirmation: '12345678'
    },
    {
      email: 'pink@mail.com',
      password: '12345678',
      password_confirmation: '12345678'
    }
  ])
end
Timeline.create([
  {
    title: "Launch of IZEAx",
    description: 'After almost a year of hard work at IZEA we launched the sponsorship marketplace! <a href="http://izea.com">Check it out!</a>',
    event_date: Time.parse("2014-03-17"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Presented on Icon Fonts",
    description: 'To kick off Front End Orlando I gave a talk on icon fonts. You can find the slides <a href="http://presentboldly.com/robdel12/icon-fonts-and-how-to-get-around-their-pitfalls">here.</a>',
    event_date: Time.parse("2014-02-25"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Started Front End Orlando Meetup",
    description: 'Orlando was lacking a front end developer specific meetup. I decided to fix that and created <a href="http://www.meetup.com/Front-End-Orlando/">Front End Orlando.</a> FEO talks about things like HTML/CSS/SAAS/JS/Angular/Ember/SEO and many more topics!',
    event_date: Time.parse("2014-01-28"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Took over Dropkick.js",
    description: "Jamie Lottering didn't want to maintain Dropkick.js anymore so I offered to take it over from him. Since then I've released 5 point releases and started work on the total rewrite of the plugin (version 2.0).",
    event_date: Time.parse("2013-07-08"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Spoke at Front End Design Conference",
    description: 'In June 2013 <a href="http://www.robert-deluca.com/presenting-at-front-end-design-conference/">I presented about Thumper</a>. Who should use it, why you should, and why I built it! <a href="http://frontenddesignconference.com/registration-info#day-two">Check it out!</a>',
    event_date: Time.parse("2013-06-22"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Started work at IZEA",
    description: "",
    event_date: Time.parse("2013-06-10"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Left ThreeTwelve Creative",
    description: "",
    event_date: Time.parse("2013-05-09"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Launched SRMA",
    description: 'First site launched on Thumper. Fully responsive enterprise site! <a href="http://aspg.com">Check it out!</a>',
    event_date: Time.parse("2013-04-03"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Digital Lee Judge",
    description: 'Announced that I\'m a judge for Lee Countys Digital competiton. <a href="https://www.facebook.com/photo.php?fbid=523863614322437&set=a.523863607655771.1073741825.159992170709585&type=1">Check it!</a>',
    event_date: Time.parse("2012-09-12"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Built Thumper",
    description: 'My own responsive grid built with LESS. <a href="/thumper">Check it out!</a>',
    event_date: Time.parse("2013-01-20"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Built/Lunched COCAD Haiti",
    description: 'First live client responsive site. <a href="http://cocad-haiti.org">Check it out!</a>',
    event_date: Time.parse("2012-12-20"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Built First Responsive Site",
    description: "",
    event_date: Time.parse("2012-09-14"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Helped Build Mission Of Hope Haiti",
    description: 'The first project I worked on with ThreeTwelve Creative. MOH is a fully custom Rails CMS. <a href="http://mohhaiti.org">Go look!</a>',
    event_date: Time.parse("2012-08-12"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Started Work At ThreeTwelve Creative",
    description: 'I\'d like to thank Natalie and David for taking me in and teaching me the ropes out of High School. <br /><a href="http://threetwelvecreative.com">ThreeTwelveCreative.com</a>',
    event_date: Time.parse("2012-07-17"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Won Digital Lee Best Of Show",
    description: "At the end of my senior year in high school I entered a county wide contest and my website won best of show.",
    event_date: Time.parse("2012-06-03"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Interned At ThreeTwelve Creative",
    description: "I did more brain leaching than any human has ever done in their life.",
    event_date: Time.parse("2012-01-01"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Built First Hand Coded Website",
    description: "Thank you to Google and NetTuts+ for the resources to do it!",
    event_date: Time.parse("2010-04-05"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Enrolled in Digital Design",
    description: "My sophomore year I enrolled in Digital Design. This was the best decision I've made.",
    event_date: Time.parse("2009-08-15"),
    created_at: Time.now,
    is_published: true
  },
  {
    title: "Born",
    description: "Kicking and screaming I was brought into this world to do something noticeable.",
    event_date: Time.parse("1994-03-19"),
    created_at: Time.now,
    is_published: true
  }
])

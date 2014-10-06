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
    {email: 'robert@mail.com',
     password: '12345678', password_confirmation: '12345678'},
    {email: 'pink@mail.com',
     password: '12345678', password_confirmation: '12345678'}
  ])

  Timeline.create(
    title: "Dat fake data",
    description: "Hallo",
    date: Time.now - 2,
    created_at: Time.now
  )

end

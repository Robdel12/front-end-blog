class Posts < ActiveRecord::Base
  # This makes it so that whenever you call class methods on Posts, only the non-draft offers show up by default.
  # Posts.all = only published posts
  # Posts.where(title: "my first post") = only published posts
  # To bypass this, call the method `unscoped`, e.g.: Posts.unscoped.where(title: "my first post")
  default_scope -> { where(is_published: true) }

  # Note that this uses the unscoped method
  scope :draft, -> { unscoped.where(is_published: false) }
end

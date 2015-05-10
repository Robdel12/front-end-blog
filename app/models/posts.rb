class Posts < ActiveRecord::Base
  after_save :tweet_new_post

private
  def tweet_new_post
    tweet = "I just published: #{self.title} http://robert-deluca.com/posts/#{self.post_slug}"

    if self.is_published && !self.is_published_was && Rails.env == "production"
      Rails.application.twitter.update(tweet)
    end
  end
end

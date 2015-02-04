class PostsSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :created_at, :post_slug, :excerpt, :published_date, :is_published
end

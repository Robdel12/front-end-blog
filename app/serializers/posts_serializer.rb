class PostsSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :published_date, :post_slug, :excerpt
end

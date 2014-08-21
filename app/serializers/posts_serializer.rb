class PostsSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :created_at, :post_slug, :excerpt
end

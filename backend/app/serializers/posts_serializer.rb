class PostsSerializer < ActiveModel::Serializer
  attributes :id, :title, :body
end

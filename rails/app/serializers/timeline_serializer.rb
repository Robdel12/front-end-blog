class TimelineSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :created_at, :date
end

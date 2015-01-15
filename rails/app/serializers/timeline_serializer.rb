class TimelineSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :created_at, :event_date, :is_published
end

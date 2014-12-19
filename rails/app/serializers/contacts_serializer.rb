class ContactsSerializer < ActiveModel::Serializer
  attributes :name, :email, :reason, :comments, :honeypot
end

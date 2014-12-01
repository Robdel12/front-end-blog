class Api::ContactsController < ApplicationController

  def index
    render json: Contacts.all
  end

  def create
    contact = Contacts.new(new_contacts_params)

    if contact.save
      ContactMailer.contact_email(contact).deliver
      render json: contact
    else
      render json: contact, status: 422
    end
  end

private

  def new_contacts_params
    params.require(:contact).permit(:name, :reason, :email, :comments)
  end

end

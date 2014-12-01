class Api::ContactsController < ApplicationController

  def index
    render json: Contacts.all
  end

  def create
    contacts = Contacts.new(new_contacts_params)

    if contacts.save
      render json: contacts
    else
      render json: contacts, status: 422
    end
  end

private

  def new_contacts_params
    params.require(:contact).permit(:name, :reason, :email, :comments)
  end

end

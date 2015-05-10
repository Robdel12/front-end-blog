class Api::ContactsController < ApplicationController
  # before_filter :authorize_user, only: [:index]

  def index
    render json: Contacts.order(created_at: :asc).last(3)
  end

  def create

    if new_contacts_params[:honeypot].present?
      return render json: "Nope", status: 422
    end

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
    params.require(:contact).permit(:name, :reason, :email, :comments, :honeypot)
  end

end

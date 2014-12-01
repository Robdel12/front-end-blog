class ContactMailer < ActionMailer::Base
  default from: "robert@robert-deluca.com"

  def contact_email(contact)
    @contact = contact
    mail(to: "robert@robert-deluca.com", subject: "New contact from #{@contact.email}", from: @contact.email)
  end

end

class AddContactTable < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.string :name
      t.string :email
      t.text :reason
      t.text :comments
      t.string :honeypot

      t.timestamps
    end
  end
end

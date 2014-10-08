class CreateTimeline < ActiveRecord::Migration
  def change
    create_table :timelines do |t|
      t.string :title
      t.datetime :event_date
      t.string :description

      t.timestamps
    end
  end
end

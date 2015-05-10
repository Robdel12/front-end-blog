class CreateTimeline < ActiveRecord::Migration
  def change
    create_table :timelines do |t|
      t.text :title
      t.datetime :event_date
      t.text :description
      t.boolean :is_published

      t.timestamps
    end
  end
end

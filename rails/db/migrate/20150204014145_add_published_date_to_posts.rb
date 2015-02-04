class AddPublishedDateToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :published_date, :datetime, default: nil
  end
end

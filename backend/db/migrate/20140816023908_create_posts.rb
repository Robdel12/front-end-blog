class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.string :post_slug
      t.datetime :published_date
      t.text :excerpt
      t.text :body

      t.timestamps
    end
  end
end

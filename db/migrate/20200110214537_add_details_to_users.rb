class AddDetailsToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :name, :string
    add_column :users, :avatar, :string
    add_column :users, :github_link, :string
    add_column :users, :state, :integer, default: 0
  end
end

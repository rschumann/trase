class CreateCommodities < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :commodities do |t|
        t.text :name, null: false
        t.timestamps
      end
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :commodities
    end
  end
end

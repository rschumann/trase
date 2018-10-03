# == Schema Information
#
# Table name: dashboards_attributes_mv
#
#  id                            :integer          primary key
#  dashboards_attribute_group_id :integer
#  position                      :integer
#  chart_type                    :string
#  created_at                    :datetime
#  updated_at                    :datetime
#  attribute_id                  :integer
#
# Indexes
#
#  dashboards_attributes_mv_group_id_attribute_id_idx  (dashboards_attribute_group_id,attribute_id)
#  dashboards_attributes_mv_id_idx                     (id) UNIQUE
#

module Api
  module V3
    module Readonly
      class DashboardsAttribute < Api::V3::Readonly::BaseModel
        self.table_name = 'dashboards_attributes_mv'
        belongs_to :readonly_attribute, foreign_key: :attribute_id, class_name: 'Attribute'

        delegate :name, to: :readonly_attribute
        delegate :display_name, to: :readonly_attribute
        delegate :original_type, to: :readonly_attribute
        delegate :original_id, to: :readonly_attribute

        def self.refresh(options = {})
          super(options)
          [
            :dashboards_flow_attributes_mv,
            :dashboards_node_attributes_mv
          ].each do |mview|
            Scenic.database.refresh_materialized_view(
              mview, concurrently: false
            )
          end
        end
      end
    end
  end
end

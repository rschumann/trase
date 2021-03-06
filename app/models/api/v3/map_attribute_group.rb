# == Schema Information
#
# Table name: map_attribute_groups
#
#  id         :integer          not null, primary key
#  context_id :integer          not null
#  name       :text             not null
#  position   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_map_attribute_groups_on_context_id      (context_id)
#  map_attribute_groups_context_id_position_key  (context_id,position) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade
#

module Api
  module V3
    class MapAttributeGroup < YellowTable
      belongs_to :context
      has_many :map_attributes

      validates :context, presence: true
      validates :name, presence: true
      validates :position, presence: true, uniqueness: {scope: :context}

      after_commit :refresh_dependents

      def self.select_options
        Api::V3::MapAttributeGroup.includes(
          context: [:country, :commodity]
        ).all.map do |group|
          [
            [
              group.context&.country&.name,
              group.context&.commodity&.name,
              group.name
            ].join(' / '),
            group.id
          ]
        end
      end

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::MapAttribute.refresh
      end
    end
  end
end

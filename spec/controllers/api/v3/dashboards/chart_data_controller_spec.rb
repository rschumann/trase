require 'rails_helper'

RSpec.describe Api::V3::Dashboards::ChartDataController, type: :controller do
  include_context 'api v3 brazil flows quants'
  include_context 'api v3 brazil municipality quant values'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh
  end

  describe 'GET index' do
    it 'returns values by year for non-temporal attribute with node values' do
      get :index, params: {
        sources_ids: [api_v3_municipality_node.id].join(','),
        attribute_id: api_v3_area.readonly_attribute.id
      }
      json = JSON.parse(response.body)
      data = json['data']
      expect(data.map { |e| e['x'] }).to eq(['NOVA UBIRATA'])
    end

    it 'returns values by year for temporal attribute with node values' do
      get :index, params: {
        sources_ids: [api_v3_municipality_node.id].join(','),
        attribute_id: api_v3_land_conflicts.readonly_attribute.id
      }
      json = JSON.parse(response.body)
      data = json['data']
      expect(data.map { |e| e['x'] }).to eq([2015])
    end

    it 'returns values by year for attribute with flows values' do
      get :index, params: {
        sources_ids: [api_v3_municipality_node.id].join(','),
        attribute_id: api_v3_volume.readonly_attribute.id
      }
      json = JSON.parse(response.body)
      data = json['data']
      expect(data.map { |e| e['x'] }).to eq([2015])
    end
  end
end

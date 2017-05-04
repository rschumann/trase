class PlaceAttributes

  def initialize(context, year, node)
    @context = context
    @year = year
    @node = node
    @node_type = @node.node_type.node_type

    # single_quant_values = NodeQuant
    #                            .select('quants.name, quants.unit, quants.unit_type, quants.frontend_name, quants.tooltip_text, node_quants.value')
    #                            .joins(:quant)
    #                            .joins(:node)
    #                            .where('place_factsheet IS TRUE AND (place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE) AND nodes.node_id = :node_id', {:node_id => node_id})
    #                            .as_json

    # single_qual_values = NodeQual
    #                           .select('quals.name, NULL as unit, NULL as unit_type, quals.frontend_name, quals.tooltip_text, node_quals.value')
    #                           .joins(:qual)
    #                           .joins(:node)
    #                           .where('place_factsheet IS TRUE AND (place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE) AND nodes.node_id = :node_id', {:node_id => node_id})
    #                           .as_json

    # single_ind_values = NodeInd
    #                          .select('inds.name, inds.unit, inds.unit_type, inds.frontend_name, inds.tooltip_text, node_inds.value')
    #                          .joins(:ind)
    #                          .joins(:node)
    #                          .where('place_factsheet IS TRUE AND (place_factsheet_temporal IS NULL OR place_factsheet_temporal IS FALSE) AND nodes.node_id = :node_id', {:node_id => node_id})
    #                          .as_json

    # @temporal_quants = Quant
    #               .select('quants.name, quants.frontend_name, quants.tooltip_text, quants.quant_id, node_quants.value,  node_quants.year')
    #               .joins(node_quants: [:node])
    #               .where('place_factsheet IS TRUE AND place_factsheet_temporal IS TRUE AND nodes.node_id = :node_id', { :node_id => node_id })

    @data = {
      column_name: @node_type,
      country_name: @context.country.name,
      country_geo_id: @context.country.iso2
    }
    ([@node] + @node.ancestors.to_a).each do |node|
      @data[(node.node_type.node_type.downcase + '_name').to_sym] = node.name
      @data[(node.node_type.node_type.downcase + '_geo_id').to_sym] = node.geo_id
    end

    @place_quals = @node.place_quals
    @place_quants = @node.place_quants
    @place_inds = @node.place_inds

    if [NodeTypeName::MUNICIPALITY, NodeTypeName::LOGISTICS_HUB].include? @node_type
      @data = @data.merge(municipality_and_logistics_hub_extra_data)
    end

    @data = @data.merge(top_traders)
    @data = @data.merge(top_consumers)
    @data = @data.merge(indicators)
    @data = @data.merge(trajectory_deforestation)
  end

  def result
    {
      data: @data
    }
  end

  def municipality_and_logistics_hub_extra_data
    data = {}

    biome_name = @place_quals[NodeTypeName::BIOME]['value']
    biome = Node.biomes.find_by_name(biome_name)
    data[:biome_name] = biome_name
    data[:biome_geo_id] = biome.try(:geo_id)
    state_name = @place_quals[NodeTypeName::STATE]['value']
    @state = Node.states.find_by_name(state_name)
    data[:state_name] = state_name
    data[:state_geo_id] = @state.try(:geo_id)
    if @place_quants['AREA_KM2'].present?
      data[:area] = @place_quants['AREA_KM2']['value']
    end
    if @place_inds['SOY_AREAPERC'].present?
      data[:soy_farmland] = @place_inds['SOY_AREAPERC']['value']
    end
    data
  end

  def top_traders
    {
      top_traders: top_nodes_summary(NodeTypeName::EXPORTER, :actors)
    }
  end

  def top_consumers
    {
      top_consumers: top_nodes_summary(NodeTypeName::COUNTRY, :countries)
    }
  end

  def indicators

    {
      indicators: [
        sustainability_indicators,
        socioeconomic_indicators
      ]
    }
  end

  def sustainability_indicators
    indicators_list = [
      {name: 'Soy deforestation (until 2014)', unit: 'ha', type: 'quant', backend_name: 'AGROSATELITE_SOY_DEFOR_'},
      {name: 'Number of environmental embargoes (2015)', type: 'quant', backend_name: 'EMBARGOES_'},
      {name: 'Area affected by fires (2013)', unit: 'km2', type: 'quant', backend_name: 'FIRE_KM2_'},
      {name: 'Cases of forced labor (2014)', type: 'quant', backend_name: 'SLAVERY'},
      {name: 'Cases of land conflicts (2014)', type: 'quant', backend_name: 'LAND_CONFL'},
      {name: 'Biodiversity (loss of amphibian habitat)', type: 'quant', backend_name: 'BIODIVERSITY'},
      {name: 'Annual deforestation rate (2015)', unit: 'ha', type: 'ind', backend_name: 'TOTAL_DEFOR_RATE'},
      {name: 'Human development index (2013)', type: 'ind', backend_name: 'HDI'},
      {name: 'Criticality of water scarcity (2013)', type: 'ind', backend_name: 'WATER_SCARCITY'}
    ]

    indicators_group(indicators_list, 'Key sustainability indicators')
  end

  def socioeconomic_indicators
    indicators_list = [
      {name: 'Soy production (2015)', unit: 'Tn', type: 'quant', backend_name: 'SOY_TN'},
      {name: 'Cattle', unit: 'heads', type: 'quant', backend_name: 'CATTLE_HEADS'},
      {name: 'Soy yield', unit: 'Tn/ha', type: 'ind', backend_name: 'SOY_YIELD'},
      {name: 'Area soy', unit: '%', type: 'ind', backend_name: 'SOY_AREAPERC'},
      {name: 'Area maize', unit: '%', type: 'ind', backend_name: 'MAIZE_AREAPERC'},
      {name: 'Area cotton', unit: '%', type: 'ind', backend_name: 'COTTON_AREAPERC'}
    ]

    indicators_group(indicators_list, 'Socio-economic indicators')
  end

  def trajectory_deforestation
    indicators_list = [
      {name: 'Soy related deforestation', backend_name: 'AGROSATELITE_SOY_DEFOR_'},
      {name: 'Potential Soy related deforestation', backend_name: 'POTENTIAL_SOY_RELATED_DEFOR'},
      {name: 'Territorial Deforestation', backend_name: 'DEFORESTATION'}
    ]
    data = @node.place_temporal_quants.
      where('quants.name' => indicators_list.map{ |i| i[:backend_name] }).
      order('node_quants.year')
    years = data.distinct.pluck('node_quants.year')
    {
      included_years: years,
      lines: indicators_list.map do |i|
        values = Hash[data.where('quants.name' => i[:backend_name]).map do |e|
          [e['year'], e]
        end]
        {
          name: i[:name],
          values: years.map{ |y| values[y] }
        }
      end
    }
  end

  private

  def top_nodes_summary(node_type, node_list_label)
    top_nodes = FlowStatsForNode.new(@context, @year, @node, node_type).top_volume_nodes
    node_value_sum = top_nodes.map{ |t| t[:value] }.reduce(0, :+)

    {
      node_list_label => top_nodes.map{ |t| {id: t['node_id'], name: t['name'], value: t['value']/node_value_sum} },
      matrix: [
        [0] + top_nodes.map{ |t| t['value'] },
        top_nodes.map{ |t| [t['value']] + Array.new((top_nodes.size - 1), 0) }
      ]
    }
  end

  def indicators_group(list, name)
    included_columns = list.map{ |i| i.slice(:name, :unit)}
    values = []
    ranking_scores = []
    list.each do |indicator|
      values <<
        if indicator[:type] == 'quant' && @place_quants[indicator[:backend_name]].present?
          @place_quants[indicator[:backend_name]]['value']
        elsif indicator[:type] == 'ind' && @place_inds[indicator[:backend_name]].present?
          @place_inds[indicator[:backend_name]]['value']
        else
          nil
        end
      stats = FlowStatsForNode.new(@context, @year, @node, @node_type)
      if @state.present?
        ranking_scores << stats.state_ranking(@state, indicator[:type], indicator[:backend_name])
      end
    end
    {
      name: name,
      included_columns: included_columns,
      rows: [
        {
          name: 'Score',
          have_unit: true,
          values: values
        },
        {
          name: 'State Ranking',
          have_unit: false,
          values: ranking_scores
        }
      ]
    }
  end
end

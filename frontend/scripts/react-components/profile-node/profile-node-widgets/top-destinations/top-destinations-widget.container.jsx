import React from 'react';
import PropTypes from 'prop-types';
import {
  GET_ACTOR_TOP_COUNTRIES,
  GET_ACTOR_TOP_SOURCES,
  GET_NODE_SUMMARY_URL
} from 'utils/getURLFromParams';
import Widget from 'react-components/widgets/widget.component';
import TopDestinationsWidget from './top-destinations-widget.component';

function TopDestinationsWidgetContainer(props) {
  const { year, nodeId, contextId, type } = props;
  const mainQuery = type === 'countries' ? GET_ACTOR_TOP_COUNTRIES : GET_ACTOR_TOP_SOURCES;
  const params = { node_id: nodeId, context_id: contextId, year };
  return (
    <Widget
      query={[mainQuery, GET_NODE_SUMMARY_URL]}
      params={[{ ...params, year }, { ...params, profile_type: 'actor' }]}
    >
      {({ data, loading, error }) => (
        <TopDestinationsWidget
          {...props}
          loading={loading}
          error={error}
          nodeSummary={data && data[GET_NODE_SUMMARY_URL]}
          topDestinations={data && data[mainQuery]}
        />
      )}
    </Widget>
  );
}

TopDestinationsWidgetContainer.propTypes = {
  testId: PropTypes.string,
  printMode: PropTypes.bool,
  className: PropTypes.string,
  countryName: PropTypes.string,
  commodityName: PropTypes.string,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  onLinkClick: PropTypes.func.isRequired
};

export default TopDestinationsWidgetContainer;

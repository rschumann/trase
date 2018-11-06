import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import {
  GET_NODE_SUMMARY_URL,
  GET_PLACE_TOP_CONSUMER_ACTORS,
  GET_PLACE_TOP_CONSUMER_COUNTRIES
} from 'utils/getURLFromParams';
import TopConsumerWidget from './top-consumers-widget.component';

function TopConsumersWidgetContainer(props) {
  const { year, nodeId, contextId, type } = props;
  const params = { node_id: nodeId, context_id: contextId, year };
  const mainQuery =
    type === 'actor' ? GET_PLACE_TOP_CONSUMER_ACTORS : GET_PLACE_TOP_CONSUMER_COUNTRIES;
  return (
    <Widget
      query={[mainQuery, GET_NODE_SUMMARY_URL]}
      params={[{ ...params, year }, { ...params, profile_type: 'place' }]}
    >
      {({ data, loading, error }) => (
        <TopConsumerWidget
          {...props}
          loading={loading}
          error={error}
          nodeSummary={data && data[GET_NODE_SUMMARY_URL]}
          topConsumers={data && data[mainQuery]}
        />
      )}
    </Widget>
  );
}

TopConsumersWidgetContainer.propTypes = {
  testId: PropTypes.string,
  onLinkClick: PropTypes.func,
  commodityName: PropTypes.string,
  year: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default TopConsumersWidgetContainer;

import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import {
  GET_ACTOR_SUSTAINABILITY,
  GET_NODE_SUMMARY_URL,
  GET_PLACE_INDICATORS
} from 'utils/getURLFromParams';
import SustainabilityTableWidget from './sustainability-table-widget.component';

function SustainabilityTableWidgetContainer(props) {
  const { year, nodeId, contextId, type, profileType } = props;
  const params = { node_id: nodeId, context_id: contextId, year };
  const mainQuery = type === 'indicators' ? GET_PLACE_INDICATORS : GET_ACTOR_SUSTAINABILITY;
  return (
    <Widget
      query={[mainQuery, GET_NODE_SUMMARY_URL]}
      params={[params, { ...params, profile_type: profileType }]}
    >
      {({ data, loading, error }) => (
        <SustainabilityTableWidget
          {...props}
          loading={loading}
          error={error}
          nodeSummary={data && data[GET_NODE_SUMMARY_URL]}
          tableData={data && data[mainQuery]}
        />
      )}
    </Widget>
  );
}

SustainabilityTableWidgetContainer.propTypes = {
  testId: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  profileType: PropTypes.string.isRequired,
  targetPayload: PropTypes.object.isRequired
};

export default SustainabilityTableWidgetContainer;

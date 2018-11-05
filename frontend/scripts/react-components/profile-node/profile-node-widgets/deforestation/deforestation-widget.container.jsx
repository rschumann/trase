import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import { GET_PLACE_DEFORESTATION_TRAJECTORY, GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import DeforestationWidget from './deforestation-widget.component';

function DeforestationWidgetContainer(props) {
  const { nodeId, contextId, year, testId } = props;
  const params = { node_id: nodeId, context_id: contextId, year };
  return (
    <Widget
      query={[GET_PLACE_DEFORESTATION_TRAJECTORY, GET_NODE_SUMMARY_URL]}
      params={[{ ...params }, { ...params, profile_type: 'place' }]}
    >
      {({ data, loading, error }) => (
        <DeforestationWidget
          error={error}
          testId={testId}
          loading={loading}
          nodeSummary={data[GET_NODE_SUMMARY_URL]}
          deforestationTrajectory={data[GET_PLACE_DEFORESTATION_TRAJECTORY]}
        />
      )}
    </Widget>
  );
}

DeforestationWidgetContainer.propTypes = {
  testId: PropTypes.string,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default DeforestationWidgetContainer;

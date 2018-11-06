import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import { GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import SummaryWidget from './summary-widget.component';

function SummaryWidgetContainer(props) {
  const { year, nodeId, context, profileType } = props;
  const params = { node_id: nodeId, context_id: context.id, profile_type: profileType, year };
  return (
    <Widget params={[params]} query={[GET_NODE_SUMMARY_URL]}>
      {({ data, loading, error }) => (
        <SummaryWidget
          {...props}
          loading={loading}
          error={error}
          nodeSummary={data && data[GET_NODE_SUMMARY_URL]}
        />
      )}
    </Widget>
  );
}

SummaryWidgetContainer.propTypes = {
  printMode: PropTypes.bool,
  context: PropTypes.object,
  tooltips: PropTypes.object,
  year: PropTypes.number.isRequired,
  scrollTo: PropTypes.func.isRequired,
  nodeId: PropTypes.number.isRequired,
  onYearChange: PropTypes.func.isRequired,
  profileType: PropTypes.string.isRequired
};

export default SummaryWidgetContainer;

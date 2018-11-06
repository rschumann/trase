import React from 'react';
import PropTypes from 'prop-types';
import Widget from 'react-components/widgets/widget.component';
import { GET_ACTOR_EXPORTING_COMPANIES, GET_NODE_SUMMARY_URL } from 'utils/getURLFromParams';
import ImportingCompaniesWidget from './importing-companies-widget.component';

function ImportingCompaniesWidgetContainer(props) {
  const { year, nodeId, contextId } = props;
  const params = { node_id: nodeId, context_id: contextId, year };
  return (
    <Widget
      query={[GET_ACTOR_EXPORTING_COMPANIES, GET_NODE_SUMMARY_URL]}
      params={[params, { ...params, profile_type: 'actor' }]}
    >
      {({ data, loading, error }) => (
        <ImportingCompaniesWidget
          {...props}
          loading={loading}
          error={error}
          nodeSummary={data && data[GET_NODE_SUMMARY_URL]}
          exportingCompanies={data && data[GET_ACTOR_EXPORTING_COMPANIES]}
        />
      )}
    </Widget>
  );
}

ImportingCompaniesWidgetContainer.propTypes = {
  testId: PropTypes.string,
  printMode: PropTypes.bool,
  countryName: PropTypes.string,
  commodityName: PropTypes.string,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired
};

export default ImportingCompaniesWidgetContainer;

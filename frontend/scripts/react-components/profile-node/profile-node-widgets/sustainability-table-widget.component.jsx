import React from 'react';
import PropTypes from 'prop-types';
import MultiTable from 'react-components/profiles/multi-table.component';
import Widget from 'react-components/widgets/widget.component';
import {
  GET_PLACE_INDICATORS,
  GET_ACTOR_SUSTAINABILITY,
  GET_NODE_SUMMARY_URL
} from 'utils/getURLFromParams';
import addApostrophe from 'utils/addApostrophe';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner.component';

class SustainabilityTableWidget extends React.PureComponent {
  getTitle(nodeName) {
    const { year, type } = this.props;
    if (type === 'indicators') {
      return 'Sustainability indicators:';
    }

    return (
      <span>
        Deforestation risk associated with <span className="notranslate">{nodeName}</span>
        {addApostrophe(nodeName)} top sourcing regions in{' '}
        <span className="notranslate">{year}</span>:
      </span>
    );
  }

  render() {
    const { year, nodeId, contextId, type, className, profileType } = this.props;
    const params = { node_id: nodeId, context_id: contextId, year };
    const mainQuery = type === 'indicators' ? GET_PLACE_INDICATORS : GET_ACTOR_SUSTAINABILITY;
    return (
      <Widget
        query={[mainQuery, GET_NODE_SUMMARY_URL]}
        params={[params, { ...params, profile_type: profileType }]}
      >
        {({ data, loading, error }) => {
          if (loading || error) {
            return (
              <section className="spinner-section">
                <ShrinkingSpinner className="-large" />
              </section>
            );
          }

          const rowCount = data[mainQuery].map(e => e.rows.length || 0).reduce((a, c) => a + c);

          if (rowCount === 0) {
            return null;
          }

          const { nodeName } = data[GET_NODE_SUMMARY_URL];
          return (
            <section className={className}>
              <div className="row">
                <div className="small-12 columns">
                  <MultiTable
                    year={year}
                    contextId={contextId}
                    type={type === 'indicators' ? 't_head_places' : 't_head_actors'}
                    data={data[mainQuery]}
                    tabsTitle={this.getTitle(nodeName)}
                    target={item => (item.name === 'Municipalities' ? 'profileNode' : null)}
                    targetPayload={{ profileType }}
                  />
                </div>
              </div>
            </section>
          );
        }}
      </Widget>
    );
  }
}

SustainabilityTableWidget.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  profileType: PropTypes.string.isRequired
};

export default SustainabilityTableWidget;
import React from 'react';
import PropTypes from 'prop-types';
import MultiTable from 'react-components/profiles/multi-table.component';
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
    const {
      year,
      contextId,
      type,
      className,
      testId,
      targetPayload,
      loading,
      error,
      nodeSummary,
      tableData
    } = this.props;

    if (loading) {
      return (
        <div className="spinner-section" data-test="loading-section">
          <ShrinkingSpinner className="-large" />
        </div>
      );
    }

    if (error) {
      // TODO: display a proper error message to the user
      console.error('Error loading sustainability table data for profile page', error);
      return (
        <div className="spinner-section" data-test="loading-section">
          <ShrinkingSpinner className="-large" />
        </div>
      );
    }

    const rowCount = tableData.map(e => e.rows.length || 0).reduce((a, c) => a + c);

    if (rowCount === 0) {
      return null;
    }

    const { nodeName } = nodeSummary;
    return (
      <section className={className} data-test={testId}>
        <div className="row">
          <div className="small-12 columns">
            <MultiTable
              year={year}
              contextId={contextId}
              type={type === 'indicators' ? 't_head_places' : 't_head_actors'}
              data={tableData}
              tabsTitle={this.getTitle(nodeName)}
              target={item => (item.name === 'Municipalities' ? 'profileNode' : null)}
              targetPayload={targetPayload}
              testId={`${testId}-multi`}
            />
          </div>
        </div>
      </section>
    );
  }
}

SustainabilityTableWidget.propTypes = {
  testId: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  targetPayload: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  nodeSummary: PropTypes.object,
  tableData: PropTypes.array
};

SustainabilityTableWidget.defaultProps = {
  nodeSummary: {},
  tableData: []
};

export default SustainabilityTableWidget;

import React from 'react';
import PropTypes from 'prop-types';
import ActorSummary from 'react-components/profiles/actor-summary.component';
import PlaceSummary from 'react-components/profiles/place-summary.component';
import ButtonLinks from 'react-components/profiles/button-links.component';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner.component';

function SummaryWidget(props) {
  const {
    printMode,
    year,
    nodeId,
    context,
    profileType,
    onYearChange,
    scrollTo,
    tooltips,
    loading,
    error,
    nodeSummary
  } = props;
  if (loading) {
    return (
      <div className="spinner-section" data-test="loading-section">
        <ShrinkingSpinner className="-large" />
      </div>
    );
  }

  if (error) {
    // TODO: display a proper error message to the user
    console.error('Error loading summary data for profile page', error);
    return (
      <div className="spinner-section" data-test="loading-section">
        <ShrinkingSpinner className="-large" />
      </div>
    );
  }

  return (
    <React.Fragment>
      {profileType === 'actor' && (
        <ActorSummary
          year={year}
          tooltips={tooltips}
          printMode={printMode}
          onYearChange={onYearChange}
          data={nodeSummary}
          context={context}
        />
      )}
      {profileType === 'place' && (
        <PlaceSummary
          year={year}
          tooltips={tooltips}
          printMode={printMode}
          onYearChange={onYearChange}
          data={nodeSummary}
          context={context}
        />
      )}
      <ButtonLinks
        year={year}
        nodeId={nodeId}
        scrollTo={scrollTo}
        contextId={context.id}
        data={nodeSummary}
      />
    </React.Fragment>
  );
}

SummaryWidget.propTypes = {
  printMode: PropTypes.bool,
  context: PropTypes.object,
  tooltips: PropTypes.object,
  year: PropTypes.number.isRequired,
  scrollTo: PropTypes.func.isRequired,
  nodeId: PropTypes.number.isRequired,
  onYearChange: PropTypes.func.isRequired,
  profileType: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  nodeSummary: PropTypes.object
};

SummaryWidget.defaultProps = {
  nodeSummary: {}
};

export default SummaryWidget;

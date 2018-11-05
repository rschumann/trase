import React from 'react';
import PropTypes from 'prop-types';
import Line from 'react-components/profiles/line.component';
import LineLegend from 'react-components/profiles/line-legend.component';

import ShrinkingSpinner from 'react-components/shared/shrinking-spinner.component';

function DeforestationWidget(props) {
  const { testId, loading, error, deforestationTrajectory, nodeSummary } = props;
  if (loading) {
    return (
      <div className="spinner-section" data-test="loading-section">
        <ShrinkingSpinner className="-large" />
      </div>
    );
  }

  if (error) {
    // TODO: display a proper error message to the user
    console.error('Error loading deforestation widget data for profile page', error);
    return (
      <div className="spinner-section" data-test="loading-section">
        <ShrinkingSpinner className="-large" />
      </div>
    );
  }

  const { lines, unit, includedYears } = deforestationTrajectory;

  if (!lines) {
    return null;
  }

  return (
    <section className="deforestation page-break-inside-avoid">
      <div className="row">
        <div className="small-12 columns">
          <h3 className="title -small" data-test={`${testId}-title`}>
            Deforestation trajectory of{' '}
            <span className="notranslate">{nodeSummary.municipalityName}</span>
          </h3>
          <div className="c-line-container">
            <div className="c-line">
              <Line
                testId={testId}
                lines={DeforestationWidget.getLastNYears(lines, 6)}
                xValues={includedYears.slice(-6)}
                unit={unit}
                margin={{ top: 0, right: 20, bottom: 30, left: 60 }}
                settingsHeight={425}
                ticks={{
                  yTicks: 7,
                  yTickPadding: 10,
                  yTickFormatType: 'deforestation-trajectory',
                  xTickPadding: 15
                }}
              />
            </div>
            <div className="c-line-legend">
              <LineLegend lines={lines} xValues={includedYears} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

DeforestationWidget.getLastNYears = function getLastNYears(lines, nYears) {
  return lines.map(line => ({
    ...line,
    values: line.values.slice(nYears * -1)
  }));
};

DeforestationWidget.defaultProps = {
  nodeSummary: {},
  deforestationTrajectory: {}
};

DeforestationWidget.propTypes = {
  testId: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.object,
  deforestationTrajectory: PropTypes.object,
  nodeSummary: PropTypes.object
};

export default DeforestationWidget;

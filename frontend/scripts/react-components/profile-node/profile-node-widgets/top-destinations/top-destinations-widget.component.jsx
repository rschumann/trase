import React from 'react';
import PropTypes from 'prop-types';
import TopDestinationsChart from 'react-components/profiles/top-destinations-chart.component';
import TopDestinationsMap from 'react-components/profiles/top-destinations-map.component';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner.component';

class TopDestinationsWidget extends React.PureComponent {
  tabs = ['municipality', 'biome', 'state'];

  state = {
    activeTab: this.props.printMode ? 'state' : 'municipality'
  };

  getActiveTabProps(data) {
    const { type } = this.props;
    const { activeTab } = this.state;
    const linesData = type === 'countries' ? data : data[activeTab];
    const { includedYears, buckets } = data;
    const { lines, style, unit } = linesData;
    return { includedYears, lines, style, unit, profileType: linesData.profile_type, buckets };
  }

  updateTab = index => this.setState({ activeTab: this.tabs[index] });

  render() {
    const {
      printMode,
      year,
      contextId,
      type,
      className,
      commodityName,
      countryName,
      onLinkClick,
      testId,
      loading,
      error,
      topDestinations,
      nodeSummary
    } = this.props;
    const { activeTab } = this.state;
    if (loading) {
      return (
        <div className="spinner-section" data-test="loading-section">
          <ShrinkingSpinner className="-large" />
        </div>
      );
    }

    if (error) {
      // TODO: display a proper error message to the user
      console.error('Error loading top destinations data for profile page', error);
      return (
        <div className="spinner-section" data-test="loading-section">
          <ShrinkingSpinner className="-large" />
        </div>
      );
    }

    const { includedYears, lines, unit, profileType, style, buckets } = this.getActiveTabProps(
      topDestinations
    );

    if (!lines || lines.length === 0) {
      return null;
    }

    const { nodeName, columnName } = nodeSummary;
    const verb = columnName === 'EXPORTER' ? 'exported' : 'imported';
    return (
      <section className={className} data-test={testId}>
        <div className="row align-justify">
          <div className="column small-12 medium-7">
            <TopDestinationsChart
              height={250}
              type={type}
              tabs={this.tabs}
              onChangeTab={this.updateTab}
              onLinkClick={onLinkClick}
              contextId={contextId}
              year={year}
              includedYears={includedYears}
              lines={lines.slice(0, 5)}
              unit={unit}
              profileType={profileType}
              style={style}
              nodeName={nodeName}
              commodityName={commodityName}
              columnName={columnName}
              verb={verb}
              testId={`${testId}-chart`}
            />
          </div>
          <div className="column small-12 medium-5 top-destinations-map-widget">
            <TopDestinationsMap
              height={250}
              year={year}
              printMode={printMode}
              verb={verb}
              buckets={buckets}
              lines={lines}
              nodeName={nodeName}
              testId={`${testId}-map`}
              profileType={profileType}
              countryName={countryName}
              commodityName={commodityName}
              activeTab={type === 'regions' ? activeTab : undefined}
            />
          </div>
        </div>
      </section>
    );
  }
}

TopDestinationsWidget.propTypes = {
  testId: PropTypes.string,
  printMode: PropTypes.bool,
  className: PropTypes.string,
  countryName: PropTypes.string,
  commodityName: PropTypes.string,
  type: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  contextId: PropTypes.number.isRequired,
  onLinkClick: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  topDestinations: PropTypes.object,
  nodeSummary: PropTypes.object
};

TopDestinationsWidget.defaultProps = {
  nodeSummary: {},
  topDestinations: {}
};

export default TopDestinationsWidget;

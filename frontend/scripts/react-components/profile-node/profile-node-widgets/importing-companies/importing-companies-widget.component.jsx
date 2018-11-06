import React from 'react';
import PropTypes from 'prop-types';
import Scatterplot from 'react-components/profiles/scatterplot.component';
import UnitsTooltip from 'react-components/shared/units-tooltip.component';
import formatValue from 'utils/formatValue';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner.component';

class ImportingCompaniesWidget extends React.PureComponent {
  state = {
    tooltipConfig: null
  };

  getScatterplots(dimensionsX, title) {
    const { printMode } = this.props;
    if (printMode) {
      return dimensionsX.map(xDimension => ({
        title: <span data-unit={xDimension.unit}>{xDimension.name}</span>
      }));
    }

    return [{ title }];
  }

  onMouseMove = data => (company, indicator, x, y) => {
    const items = [
      {
        title: data.dimensionY.name,
        value: formatValue(company.y, data.dimensionY.name),
        unit: data.dimensionY.unit
      },
      {
        title: indicator.name,
        value: formatValue(company.x, indicator.name),
        unit: indicator.unit
      }
    ];
    const tooltipConfig = { x, y, text: company.name, items };
    this.setState(() => ({ tooltipConfig }));
  };

  onMouseLeave = () => {
    this.setState(() => ({ tooltipConfig: null }));
  };

  render() {
    const {
      year,
      nodeId,
      printMode,
      commodityName,
      countryName,
      testId,
      loading,
      error,
      nodeSummary,
      exportingCompanies
    } = this.props;
    const { tooltipConfig } = this.state;

    if (loading) {
      return (
        <div className="spinner-section" data-test="loading-section">
          <ShrinkingSpinner className="-large" />
        </div>
      );
    }

    if (error) {
      // TODO: display a proper error message to the user
      console.error('Error loading importing companies data for profile page', error);
      return (
        <div className="spinner-section" data-test="loading-section">
          <ShrinkingSpinner className="-large" />
        </div>
      );
    }

    const { dimensionsX, companies } = exportingCompanies;
    const { nodeName, columnName } = nodeSummary;
    const verb = columnName === 'EXPORTER' ? 'exporting' : 'importing';
    const dimensions = dimensionsX.slice(0, 3);
    const title = `Comparing companies ${verb} ${commodityName} from ${countryName} in ${year}`;
    const scatterplots = this.getScatterplots(dimensions, title);
    return (
      <section className="c-scatterplot-container" data-test={testId}>
        <UnitsTooltip show={!!tooltipConfig} {...tooltipConfig} />
        <div className="row">
          <div className="small-12 columns">
            <div>
              {printMode && <h3 className="title">{title}</h3>}
              {scatterplots.map((plot, index) => (
                <Scatterplot
                  key={index}
                  title={plot.title}
                  data={companies}
                  xDimension={dimensions}
                  xDimensionSelectedIndex={index}
                  testId={`${testId}-scatterplot`}
                  node={{ id: nodeId, name: nodeName }}
                  year={year}
                  showTooltipCallback={this.onMouseMove(exportingCompanies)}
                  hideTooltipCallback={this.onMouseLeave}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

ImportingCompaniesWidget.propTypes = {
  testId: PropTypes.string,
  printMode: PropTypes.bool,
  countryName: PropTypes.string,
  commodityName: PropTypes.string,
  year: PropTypes.number.isRequired,
  nodeId: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  nodeSummary: PropTypes.object,
  exportingCompanies: PropTypes.object
};

ImportingCompaniesWidget.defaultProps = {
  nodeSummary: {},
  exportingCompanies: {}
};

export default ImportingCompaniesWidget;

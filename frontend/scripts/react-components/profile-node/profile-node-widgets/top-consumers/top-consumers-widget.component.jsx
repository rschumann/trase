import React from 'react';
import PropTypes from 'prop-types';
import MiniSankey from 'react-components/profiles/mini-sankey.component';
import { withTranslation } from 'react-components/nav/locale-selector/with-translation.hoc';
import capitalize from 'lodash/capitalize';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner.component';

const TranslatedMiniSankey = withTranslation(MiniSankey);

class TopConsumersWidget extends React.PureComponent {
  getTitle(name) {
    const { type, year, commodityName } = this.props;
    const noun = type === 'actor' ? 'traders' : 'importer countries';
    if (type === 'actor') {
      return (
        <React.Fragment>
          Top {noun} of {commodityName} in <span className="notranslate">{capitalize(name)}</span>{' '}
          in <span className="notranslate">{year}</span>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        Top {noun} of <span className="notranslate">{capitalize(name)}</span> {commodityName} in{' '}
        <span className="notranslate">{year}</span>
      </React.Fragment>
    );
  }

  handleLinkClick = (linkTarget, { profileType, query }) => {
    this.props.onLinkClick(profileType, query);
  };

  render() {
    const {
      year,
      contextId,
      type,
      onLinkClick,
      testId,
      loading,
      error,
      topConsumers,
      nodeSummary
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
      console.error('Error loading top consumer data for profile page', error);
      return (
        <div className="spinner-section" data-test="loading-section">
          <ShrinkingSpinner className="-large" />
        </div>
      );
    }

    if (topConsumers && topConsumers.targetNodes && topConsumers.targetNodes.length === 0) {
      return null;
    }

    const { municipalityName } = nodeSummary;
    return (
      <section className="mini-sankey-container page-break-inside-avoid" data-test={testId}>
        <div className="row">
          <div className="small-12 columns">
            <h3 className="title -small" data-test={`${testId}-title`}>
              {this.getTitle(municipalityName)}
            </h3>
            <TranslatedMiniSankey
              year={year}
              data={topConsumers}
              contextId={contextId}
              testId={`${testId}-mini-sankey`}
              onLinkClick={this.handleLinkClick}
              targetLink={onLinkClick && 'profileNode'}
              targetPayload={onLinkClick && { profileType: type }}
            />
          </div>
        </div>
      </section>
    );
  }
}

TopConsumersWidget.propTypes = {
  testId: PropTypes.string,
  onLinkClick: PropTypes.func,
  commodityName: PropTypes.string,
  year: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  contextId: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.any,
  topConsumers: PropTypes.object,
  nodeSummary: PropTypes.object
};

TopConsumersWidget.defaultProps = {
  topConsumers: {},
  nodeSummary: {}
};

export default TopConsumersWidget;

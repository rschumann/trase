import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import LinkButton from 'react-components/shared/link-button.component';
import HighlightTextFragments from 'react-components/shared/highlight-text-fragments.component';

class GlobalSearchResult extends Component {
  state = {
    hoverOverLink: false
  };

  shouldComponentUpdate(nextProps, prevState) {
    return (
      (!nextProps.isLoading && this.props.isLoading) ||
      nextProps.isHighlighted !== this.props.isHighlighted ||
      prevState.hoverOverLink !== this.state.hoverOverLink
    );
  }

  onMouseEnter = () => this.setState({ hoverOverLink: true });

  onMouseOut = () => this.setState({ hoverOverLink: false });

  render() {
    const { value, itemProps, isHighlighted, item, testId } = this.props;

    return (
      <li {...itemProps} className={cx('c-search-result', { '-highlighted': isHighlighted })}>
        <div className="search-node-text-container" data-test={testId}>
          <span className="search-node-type">{item.nodeTypeText}</span>
          <span className="search-node-name">
            <HighlightTextFragments text={item.name} highlight={value} />
          </span>
        </div>
        <div className="search-node-actions-container">
          <LinkButton
            className={cx('-medium-large', { '-charcoal': !this.state.hoverOverLink })}
            to={{
              type: 'tool',
              payload: {
                query: {
                  state: {
                    isMapVisible: false,
                    selectedContextId: item.contextId,
                    selectedNodesIds: item.nodes.map(i => i.id),
                    expandedNodesIds: item.nodes.map(i => i.id)
                  }
                }
              }
            }}
            data-test={`${testId}-tool-link`}
          >
            Supply Chain
          </LinkButton>
          {item.isSubnational && (
            <LinkButton
              className="-medium-large"
              onMouseEnter={this.onMouseEnter}
              onMouseOut={this.onMouseOut}
              onBlur={this.onMouseOut}
              to={{
                type: 'tool',
                payload: {
                  query: {
                    state: {
                      isMapVisible: true,
                      selectedContextId: item.contextId,
                      selectedNodesIds: item.nodes.map(i => i.id),
                      expandedNodesIds: item.nodes.map(i => i.id)
                    }
                  }
                }
              }}
              data-test={`${testId}-map-link`}
            >
              Map
            </LinkButton>
          )}

          {item.nodes
            .filter(n => n.profile)
            .map(node => (
              <LinkButton
                onMouseEnter={this.onMouseEnter}
                onMouseOut={this.onMouseOut}
                onBlur={this.onMouseOut}
                className="-medium-large"
                key={node.id}
                to={{
                  type: 'profileNode',
                  payload: {
                    query: {
                      nodeId: node.id,
                      year: item.defaultYear,
                      contextId: item.contextId
                    },
                    profileType: node.profile
                  }
                }}
                data-test={`${testId}-${node.nodeType}-link`.toLowerCase()}
              >
                See {node.nodeType} profile
              </LinkButton>
            ))}
        </div>
      </li>
    );
  }
}

GlobalSearchResult.propTypes = {
  isLoading: PropTypes.bool,
  showMap: PropTypes.bool,
  value: PropTypes.string,
  itemProps: PropTypes.object,
  isHighlighted: PropTypes.bool,
  item: PropTypes.object,
  testId: PropTypes.string
};

export default GlobalSearchResult;

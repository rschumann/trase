/* eslint-disable  jsx-a11y/interactive-supports-focus */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import SearchInputResult from 'react-components/shared/search-input/search-input-result.component';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import ShrinkingSpinner from 'react-components/shared/shrinking-spinner.component';
import { MAX_SEARCH_RESULTS } from 'constants';

const SEARCH_DEBOUNCE_RATE_IN_MS = 400;

class SearchInput extends PureComponent {
  onInputValueChange = debounce(
    searchTerm => this.props.onSearchTermChange && this.props.onSearchTermChange(searchTerm),
    SEARCH_DEBOUNCE_RATE_IN_MS
  );

  focusInput(e) {
    const input = e.currentTarget.querySelector('input');
    if (input) input.focus();
  }

  stateReducer = (state, changes) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.clickItem:
      case Downshift.stateChangeTypes.keyDownEnter: {
        return {
          ...changes,
          highlightedIndex: null,
          isOpen: false,
          inputValue: ''
        };
      }
      default:
        return changes;
    }
  };

  renderSearchBox = ({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => {
    const {
      className,
      isLoading,
      items,
      placeholder,
      placeholderSmall,
      testId,
      getResultTestId,
      resultClassName,
      nodeTypeRenderer
    } = this.props;
    const visibleResults = items.slice(0, MAX_SEARCH_RESULTS);

    return (
      <div className={cx('c-search-input', className)} data-test={`search-input-${testId}`}>
        <div
          className={cx('search-input-bar', { '-loading': isLoading })}
          onClick={this.focusInput}
          role="textbox"
        >
          <input
            {...getInputProps({ placeholder: placeholderSmall })}
            type="search"
            className="search-input-field show-for-small"
          />
          <input
            {...getInputProps({ placeholder })}
            type="search"
            className="search-input-field hide-for-small"
            data-test="search-input-desktop"
          />
          {isLoading ? (
            <ShrinkingSpinner className="-dark" />
          ) : (
            <svg className="icon icon-search">
              <use xlinkHref="#icon-search" />
            </svg>
          )}
        </div>
        {isOpen && visibleResults.length > 0 && (
          <ul className="search-input-results">
            {visibleResults.map((item, row) => (
              <SearchInputResult
                key={item.id}
                item={item}
                className={resultClassName}
                testId={getResultTestId(item)}
                searchString={inputValue}
                itemProps={getItemProps({ item })}
                nodeTypeRenderer={nodeTypeRenderer}
                isHighlighted={row === highlightedIndex}
              />
            ))}
          </ul>
        )}
      </div>
    );
  };

  render() {
    return (
      <Downshift
        onSelect={node => this.props.onSelect(node, this.props.year)}
        stateReducer={this.stateReducer}
        itemToString={i => (i === null ? '' : i.name)}
        onInputValueChange={this.onInputValueChange}
      >
        {this.renderSearchBox}
      </Downshift>
    );
  }
}

SearchInput.propTypes = {
  year: PropTypes.number,
  testId: PropTypes.string,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  getResultTestId: PropTypes.func,
  nodeTypeRenderer: PropTypes.func,
  items: PropTypes.array.isRequired,
  resultClassName: PropTypes.string,
  placeholderSmall: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onSearchTermChange: PropTypes.func.isRequired
};

SearchInput.defaultProps = {
  placeholder: 'search',
  placeholderSmall: 'search',
  getResultTestId: item => `search-result-${item.name}`
};

export default SearchInput;

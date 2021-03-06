import React from 'react';
import PropTypes from 'prop-types';
import Hero from 'react-components/shared/hero.component';
import NotFound from './not-found.component';

class StaticContent extends React.PureComponent {
  render() {
    const { Content, notFound } = this.props;

    return (
      <div className="c-static-content">
        <Hero className="-read-only" />
        {notFound ? <NotFound /> : <Content />}
      </div>
    );
  }
}

StaticContent.propTypes = {
  Content: PropTypes.func,
  notFound: PropTypes.bool
};

export default StaticContent;

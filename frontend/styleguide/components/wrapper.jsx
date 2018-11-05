/* eslint-disable react/prop-types */
import React from 'react';

const { Provider } = require('react-redux');
const { store } = require('scripts/store/index');

function Wrapper(props) {
  return <Provider store={store}>{props.children}</Provider>;
}

export default Wrapper;

/* eslint-disable global-require,import/no-extraneous-dependencies */
import rangeTouch from 'rangetouch';
import { register, unregister } from './worker';
import { initStore } from './store';

window.liveSettings = TRANSIFEX_API_KEY && {
  api_key: TRANSIFEX_API_KEY,
  autocollect: true
};

// Rangetouch to fix <input type="range"> on touch devices (see https://rangetouch.com)
rangeTouch.set();

if (USE_SERVICE_WORKER) {
  register();
} else {
  unregister();
}

if (process.env.NODE_ENV !== 'production' && PERF_TEST) {
  const React = require('react');
  const { whyDidYouUpdate } = require('why-did-you-update');

  whyDidYouUpdate(React);
}

initStore();

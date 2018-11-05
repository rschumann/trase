/* eslint-disable global-require */
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import router from 'scripts/router/router';
import routeSubscriber from 'scripts/router/route-subscriber';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { toolUrlStateMiddleware } from 'scripts/utils/stateURL';
import analyticsMiddleware from 'scripts/analytics/middleware';
import { rootSaga } from './sagas';
import * as appReducers from './reducers';

const sagaMiddleware = createSagaMiddleware();

// analytics middleware has to be after router.middleware
const middlewares = [
  thunk,
  sagaMiddleware,
  router.middleware,
  toolUrlStateMiddleware,
  analyticsMiddleware
];

if (REDUX_LOGGER_ENABLED) {
  const { createLogger } = require('redux-logger');

  const loggerMiddleware = createLogger({
    collapsed: true
  });

  middlewares.push(loggerMiddleware);
}

const composeEnhancers =
  (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const reducers = combineReducers({
  ...appReducers,
  location: router.reducer
});

export const store = createStore(
  reducers,
  undefined,
  composeEnhancers(router.enhancer, applyMiddleware(...middlewares))
);

export function initStore() {
  routeSubscriber(store);
  sagaMiddleware.run(rootSaga);
}

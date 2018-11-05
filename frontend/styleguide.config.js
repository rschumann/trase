const path = require('path');
const webpackConfig = require('./config/webpack.config.dev');
const { version } = require('./package.json');
require('babel-polyfill');

module.exports = {
  webpackConfig,
  require: [path.resolve(__dirname, 'styleguide/config.js')],
  title: `Trase components | ${version}`,
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700'
        }
      ]
    }
  },
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide/components/wrapper.jsx')
  },
  sections: [
    {
      name: 'Shared',
      components: () => [
        path.resolve(__dirname, 'scripts/react-components/shared/**/*.component.jsx')
      ]
    }
  ]
};

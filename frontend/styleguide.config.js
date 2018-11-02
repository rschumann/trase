const path = require('path');
const webpackConfig = require('./config/webpack.config.dev');
const { version } = require('./package.json');

module.exports = {
  webpackConfig,
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
  sections: [
    {
      name: 'Shared',
      content: path.resolve(__dirname, 'styleguide/shared.md'),
      components: () => [
        path.resolve(__dirname, 'scripts/react-components/shared/**/*.component.{js,jsx}')
      ]
    }
  ]
};

var webpack = require('webpack');

module.exports = {
  entry: './components/bug-log.js',
	output: {
		path: 'build',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader' }
		]
	},
	resolve: {
		// write require('dependency') instead of require('dependency.js') or require('dependency.coffee')
		extensions: ['', '.js', '.json', '.coffee']
	}
};

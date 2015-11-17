var webpack = require('webpack');

module.exports = {
	entry: {
		Student: './components/students/main.js',
		Fellow: './components/fellows/main.js'
	},
	output: {
		path: 'build'
		filename: '[name].js'
	},
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader' },
			{ test: /\.(png|jpg|jpeg)$/, loader: 'url-loader?limit8192' }
		]
	},
	resolve: {
		// write require('dependency') instead of require('dependency.js') or require('dependency.coffee')
		extensions: ['', '.js', '.json', '.coffee']
	}
};
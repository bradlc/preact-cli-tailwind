const glob = require('glob-all');
const path = require('path');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

export default (config, env, helpers) => {
	helpers.getLoadersByName(config, 'postcss-loader').forEach(rule => {
		rule.loader.options.plugins = [
			require('tailwindcss')('./tailwind.js')
		].concat(rule.loader.options.plugins);
	});

	config.plugins.push(new HtmlWebpackInlineSourcePlugin());

	helpers.getPluginsByName(config, 'HtmlWebpackPlugin').forEach(plugin => {
		plugin.plugin.options.inlineSource = '.css$';
	});

	config.plugins.push(
		new PurgecssPlugin({
			paths: glob.sync([
				path.join(__dirname, 'src/routes/**/*.js'),
				path.join(__dirname, 'src/components/**/*.js')
			]),
			whitelist: ['html', 'body'],
			extractors: [
				{
					extractor: class {
						static extract(content) {
							return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
						}
					},
					extensions: ['js']
				}
			]
		})
	);
};

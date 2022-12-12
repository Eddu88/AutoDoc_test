const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: __dirname + '/../wwwroot',
        filename: 'bundle.[contenthash].js',
        assetModuleFilename: "assets/[name][ext]",
        clean: true
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.png/,
                type: 'asset/inline'
            },
            {
                test: /\.jira$/,
                type: 'asset/source',
            },
            {
                test: /\.template/,
                include: path.resolve(__dirname, "src"),
                type: "asset/resource",
                generator: {
                    filename: "assets/[name][ext]",
                },
            },
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            filename: 'index.html'
        })
    ],
    // DevServer
    devServer: {
        port: 8081,
        open: true,
        compress: true,
        hot: true,
        liveReload: true,
        watchFiles: ["src/*.html"],
    }
}
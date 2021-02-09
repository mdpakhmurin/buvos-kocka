const path = require('path')
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },

    module: {
        rules: [
            {
                test: /\.pug$/i,
                loader: 'pug-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  "style-loader",
                  "css-loader",
                  "sass-loader"
                ],
            },
            {
                test: /\.css$/i,
                use: [
                  "style-loader",
                  "css-loader"
                ]	     
            },
            {
                // FONT LOADER
                test: /\.(woff(2)?|ttf|svg|eot)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'fonts/',
                            publicPath: 'fonts/' 
                        }
                    }
                ]
            },
            {
                // FONT LOADER
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images/',
                            publicPath: 'images/' 
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        ...glob.sync(`./src/pages/*`).map(page => new HtmlWebpackPlugin({
            template: page,
            filename: `pages/${path.basename(page, path.extname(page))}.html`
        })),
        new CleanWebpackPlugin(),
    ],

    devServer: {
        contentBase: path.join(__dirname, 'dist/pages'),
        compress: true,
        writeToDisk:true,
        port: 8080,
    },
}
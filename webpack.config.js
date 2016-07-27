var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var extend = require('extend');
var entry = require('./src/config/vendor');
var externals = require('./src/config/externals');
var config = require('./src/config/base.config');
var alias = require('./src/config/alias.json');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CortexRecombinerPlugin=require('cortex-recombiner-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
//?presets[]=stage-0,presets[]=react,presets[]=es2015

//var headerTpl = require('./src/html/test.js');

var setExternals= function() {
    var external=externals;

    return external;
};

var baseFileDir = path.join(process.cwd(), 'src/');

var htmlPlugin=[];

var getEntry = function(){
    var basedir =baseFileDir+'action';
    var files = glob.sync(path.join(basedir, '*.js'));

    var webpackConfigEntry = {};//webpackConfig.entry || (webpackConfig.entry = {});

    files.forEach(function(file) {
        var relativePath = path.relative(basedir, file);
        webpackConfigEntry[relativePath.replace(/\.js/,'').toLowerCase()] = [file];
        generateHtml(relativePath.replace(/\.js/,'').toLowerCase() );
    });
    webpackConfigEntry.dev = path.join(__dirname, 'src/utils/dev.js');
    return webpackConfigEntry;
};


function setCommonsChuck(){
    var arr=[];
    for(var item in entry){
        arr.push(item);
    }
    return arr;
}
function generateHtml(htmlName){
    //var path = config.html+'/'+htmlName+'.html';
    htmlPlugin.push(
        new HtmlWebpackPlugin({
            title: htmlName,
            template: path.resolve(config.html, htmlName+'.html'),
            filename: htmlName+'.html',
            chunks: ['common','dev', htmlName],
            inject: 'body'
        })

    );
}

//extend(getEntry(),entry||{}),
var entryList =config.projectType=='app'? extend(getEntry(),entry||{}) : extend({bundle:path.join(__dirname, 'src/index.js')},entry||{});

var webpackConfig = {
    entry: entryList,
    output: {
        path:path.join(__dirname, config.output.replace('./','') ),
        filename: '[name].js',
        libraryTarget: "umd",
        publicPath: config.cdn,
        chunkFilename: '[name].[chunkhash].js',
        sourceMapFilename: '[name].map'
    },
    cache: true,
    devtool: 'source-map',
    externals:setExternals(),
    resolve: {
        extensions: ['', '.js'],
        alias:extend({},alias ||{})
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/
            },
            {
                test: /\.(less$)$/,
                loader: ExtractTextPlugin.extract("css!postcss!less")
                //loader: "style-loader!css-loader!less-loader"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css?-restructuring!postcss')
            },
            {
                test: /\.svg$/,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
            },
            {
                test: /\.woff|ttf|woff2|eot$/,
                loader: 'url?limit=100000'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url?limit=35000'/*,
                     'image-webpack?progressive&optimizationLevel=3&interlaced=false'*/
                ]
            },
            {
                test: /\.html$/,
                loader: "handlebars-loader"
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-loader?variable=data'
            }
        ]
    },
    /*postcss: [
     require('autoprefixer'),
     require('postcss-color-rebeccapurple')
     ],*/
    postcss: function () {
        //处理css兼容性代码，无须再写-webkit之类的浏览器前缀
        return [
            require('postcss-initial')({
                reset: 'all' // reset only inherited rules
            }),
            require('autoprefixer')({
                browsers: ['> 5%']
            })];
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("[name].css", {
            disable: false,
            allChunks: true
        }),
        new CortexRecombinerPlugin({
            base:__dirname//path.resolve(__dirname,relativeToRootPath),//项目根目录的绝对路径
        }),
        new webpack.ProvidePlugin({
            $:      "jquery",
            jQuery: "jquery"
        }),
        new webpack.ProvidePlugin({
            _: "underscore"
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "common.js",
            minChunks: Infinity

        })
    ]/*.concat(htmlPlugin)*/
};

console.log(config.env);

if(config.env!='beta'&& config.env!='dev'){
    console.log('..........----pro----.............');
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
    webpackConfig.plugins.push(
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        })
    )
}

module.exports = webpackConfig;

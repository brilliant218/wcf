import webpackDefaultConfig from './getWebpackDefaultConfig';
import mergeCustomConfig from './mergeWebpackConfig';
import {path,resolve} from 'path';
import webpack from 'webpack';
/** 
 * @param  {[type]} 
 * @param  {Function} 
 * @return {[type]}
 */
export default function build(program,callback){
 let defaultWebpackConfig=webpackDefaultConfig(program);
 //get default webpack configuration

 if(program.outputPath){
  	defaultWebpackConfig.output.path=program.outputPath;
 }
 //update output path
if(program.publichPath){
	defaultWebpackConfig.output.publicPath = program.publicPath;
}
//update public path
 if (program.compress) {
  //https://github.com/mishoo/UglifyJS2
    defaultWebpackConfig.plugins = [...defaultWebpackConfig.plugins,
      new webpack.optimize.UglifyJsPlugin({
         beautify:false,
         sourceMap :true,
         // use SourceMaps to map error message locations to modules. 
         //This slows down the compilation. (default: true)
         comments:false,
        //Defaults to preserving comments containing /*!, /**!, @preserve or @license.
      	 output: {
            ascii_only: true,
	      },
	      compress: {
	        warnings: false,
          //no warnings when remove unused code,
          drop_console :true,
          //drop console
          collapse_vars: true,
          //Collapse single-use var and const definitions when possible.
          reduce_vars: true,
          // Improve optimization on variables assigned with and used as constant values.
	      },
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
    ];
  } else {
    if (process.env.NODE_ENV) {
      defaultWebpackConfig.plugins = [...defaultWebpackConfig.plugins,
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
      ];
    }
  }
// update our plugins according to user's input compress config
if (program.hash) {
const pkg = require(join(program.cwd, 'package.json'));
defaultWebpackConfig.output.filename = defaultWebpackConfig.output.chunkFilename = '[name]-[chunkhash].js';
//we update filename width hash
}

if (typeof program.config === 'function') {
 defaultWebpackConfig = program.config(defaultWebpackConfig) || defaultWebpackConfig;
} else {
  defaultWebpackConfig = mergeCustomConfig(defaultWebpackConfig, resolve(program.cwd, program.config || 'webpack.config.js'));
}
//if config parameter is a function ,invoke it. otherwise merge our custom configuration
 if (program.watch) {
    [defaultWebpackConfig].forEach(config => {
      config.plugins.push(
        new ProgressPlugin((percentage, msg) => {
          const stream = process.stderr;
          if (stream.isTTY && percentage < 0.71) {
            stream.cursorTo(0);
            stream.write(`📦  ${chalk.magenta(msg)}`);
            stream.clearLine(1);
          } else if (percentage === 1) {
            console.log(chalk.green('\nwebpack: bundle build is now finished.'));
          }
        })
      );
    });
  }

  const compiler = webpack(defaultWebpackConfig);
  // Hack: remove extract-text-webpack-plugin log
  if (!program.verbose) {
    compiler.plugin('done', (stats) => {
    //    console.log('stats',stats);

      // stats.stats.forEach((stat) => {
      //   //compilation.children是他所有依赖的模块信息
      //   stat.compilation.children = stat.compilation.children.filter((child) => {
      //     return child.name !== 'extract-text-webpack-plugin';
      //   });
      // });
    });
  }
  //we watch file change
  if (program.watch) {
    compiler.watch(program.watch || 200, doneHandler.bind(this));
  } else {
    compiler.run(doneHandler.bind(this));
  }
}

function doneHandler(err, stats) {
  console.log('resource rebuilt');
}


const path = require('path');
const envParam = require('./envParam.js');

module.exports = {
  plugins: ['react'],
  config: {
    exports: [
      ['babel-polyfill', './scripts/index.js'],
      ['babel-polyfill', './scripts/login.js'],
    ],
    modifyWebpackConfig(baseConfig) {
      const envData = envParam[this.env];
      baseConfig.plugins.push(new this.webpack.DefinePlugin({
        ENV_CONFIG: JSON.stringify(envData),
      }));

      baseConfig.resolve.alias = {
        COMPONENT: '/src/scripts/component',
        CONST: '/src/scripts/const',
        PAGE: '/src/scripts/page',
        ROUTER: '/src/scripts/router',
        STORE: '/src/scripts/store',
        UTIL: '/src/scripts/util',
      };
      // 剔除依赖库 CDN引入
      baseConfig.externals = {
        react: 'React',
        'react-dom': 'ReactDOM',
        // 'antd': 'antd',
        // 'moment': 'moment'
      };

      baseConfig.module.loaders = baseConfig.module.loaders.filter((loader) => {
        if (loader.test.toString()
          .match(/(css|less)/)) {
          return false;
        }
        return true;
      });
      baseConfig.module.loaders.push({
        test: /.css$/,
        loader: 'style-loader!css-loader',
        include: [
          path.join(__dirname, './src/styles'),
        ],
      }, {
          test: /\.json$/,
          loader: 'json-loader',
        }, {
          test: /.css$/,
          loader: 'style-loader!css-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]',
          include: [
            path.join(__dirname, './src/scripts'),
          ],
        }, {
          test: /.less$/,
          include: [
            path.join(__dirname, './src/styles'),
            path.join(__dirname, './src/scripts'),
          ],
          loader: 'style-loader!css-loader!less-loader',
        });

      return baseConfig;
    },
    commonsChunk: {
      minChunks: 2, // 公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks,默认为2
      vendors: { // vendors是一个处理第三方库的配置项，结构是一个key,value数组,key是chunkname，value是第三方类库数组
        lib: ['babel-polyfill',
          'react',
          'react-router',
          'mobx',
          'antd',
          'axios',
          'jsonp',
          'promise-polyfill',
        ],
      },
    },
    server: {
      hot: true,
    },
  },
};

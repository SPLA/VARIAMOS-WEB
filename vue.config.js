module.exports = {
  publicPath: "/",
  configureWebpack: {
      devtool: 'source-map'  
  },
  devServer: {
    host: "localhost"
  }
  //https://github.com/vuejs/vue-cli/issues/2590#issuecomment-559015806
  //http://cheng.logdown.com/posts/2016/03/25/679045
  //chainWebpack: config => {
    //if (process.env.NODE_ENV === 'test' || process.env.npm_lifecycle_event === 'test:unit') {
      /* const sassRule = config.module.rule('sass');
      sassRule.uses.clear();
      sassRule.use('null-loader').loader('null-loader');
      sassRule.oneOf('normal').uses.clear();
      sassRule.oneOf('normal').use('null-loader').loader('null-loader'); */
      //config.merge({
        //devtool: 'cheap-module-eval-source-map',
      //});
    //});
  //}
};

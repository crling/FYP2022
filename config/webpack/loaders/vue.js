module.exports = 
{
  test: /\.vue(\.erb)?$/,
  use: [{
    loader: 'vue-loader',
  }]
}
// {
//   test: /\.vue$/,
//   loader: 'vue-loader',
//   options: {
//     loaders: {
//       // scss: 'style-loader!css-loader!sass-loader', // <style lang="scss">
//       sass: 'style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
//     }
//   }
// }
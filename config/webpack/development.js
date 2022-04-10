process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')

// if (process.env.PACK) {
//     const target = `viz/${process.env.PACK}`;
//     console.log(`Single pack mode: only compile ${target}`);

//     let found = false;
//     Object.keys(environment.entry).forEach(k => {
//         if (k.startsWith("viz/")) {
//             if (k === target) {
//                 found = true;
//             } else {
//                 delete environment.entry[k];
//             }
//         }
//     });
//     if (!found) {
//         throw new Error(`The specified pack is not found.`);
//     }
// }
module.exports = environment.toWebpackConfig()
// use another port
// const path = require('path');
// module.exports = {
//     ...environment.toWebpackConfig(),
//     devServer: {
//       contentBase: path.join(__dirname, 'dist'),
//       compress: true,
//       port: 3036,
//     },
//   };
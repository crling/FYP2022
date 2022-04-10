process.env.NODE_ENV = process.env.NODE_ENV || "production";

const environment = require("./environment");

const conf = environment.toWebpackConfig();
conf.devtool = "none";

module.exports = conf;

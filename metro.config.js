const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resetCache = true;
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
};

module.exports = config;

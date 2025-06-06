const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const {
    wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
        assetExts: [...defaultConfig.resolver.assetExts, "lottie"],
    },
};

module.exports = wrapWithReanimatedMetroConfig(mergeConfig(defaultConfig, config));

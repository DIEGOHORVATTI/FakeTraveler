const { withNativewind } = require('nativewind/metro')
const { getDefaultConfig } = require('expo/metro-config')

module.exports = withNativewind(getDefaultConfig(__dirname))

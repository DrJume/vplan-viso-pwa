module.exports = {
  pwa: {
    name: 'V-Plan',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    workboxOptions: {
      skipWaiting: true
    }
  },
  publicPath: '/vplan/',
  css: {
    sourceMap: true
  }
}

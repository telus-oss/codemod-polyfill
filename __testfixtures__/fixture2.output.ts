const additionalBodyResources = [
  {
    type: 'js',
    link:
      "https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?version=4.8.0",
  },
  {
    type: 'js',
    link: bundleInfo.vendor.js,
  },
  {
    type: 'js',
    link: bundleInfo.bundle.js,
  },
  {
    type: 'js',
    link: chatWidget,
  },
];

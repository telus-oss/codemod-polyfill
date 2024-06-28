const additionalBodyResources = [
  {
    type: 'js',
    link:
      "https://polyfill.io/v3/polyfill.min.js?features=es2016%2Ces6%2CArray.prototype.includes%2Cfetch%2CSet%2CArray.prototype.entries%2CObject.entries%2CIntersectionObserver%2CIntersectionObserverEntry",
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

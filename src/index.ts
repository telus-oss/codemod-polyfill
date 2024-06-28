import type { API, FileInfo, Options } from 'jscodeshift';

const domains = [
  'cdn.polyfill.io',
  'polyfill.io',
  'cdn.bootcdn.net',
  'cdn.bootcss.com',
  'cdn.staticfile.net',
  'cdn.staticfile.org',
];

const newUrl = 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?version=4.8.0';

export default function transform(
  file: FileInfo,
  api: API,
  options?: Options,
): string | undefined {
  // Check if the file is an HTML file
  if (file.path.endsWith('.html')) {
    let updatedSource = file.source;
    domains.forEach(domain => {
      const regex = new RegExp(`https?:\\/\\/(${domain.replace(/\./g, '\\.')})[^"']*`, 'g');
      updatedSource = updatedSource.replace(regex, newUrl);
    });
    return updatedSource;
  }

  const j = api.jscodeshift;
  const root = j(file.source);

  // Find all Literal nodes (which includes strings)
  root.find(j.Literal).forEach((path) => {
    // Check if the value is a string and contains one of the old URLs
    if (
      typeof path.node.value === 'string' && domains.some((domain) => {
        const regex = new RegExp(`https?:\\/\\/(${domain.replace(/\./g, '\\.')})[^"']*`, 'g');
        return regex.test(path.node.value);
      })
    ) {
      // Replace the old URL with the new URL
      path.node.value = path.node.value.replace(new RegExp(`https?:\\/\\/(${domains.map(d => d.replace(/\./g, '\\.')).join('|')})[^"']*`, 'g'), newUrl);
    }
  });

  return root.toSource();
}

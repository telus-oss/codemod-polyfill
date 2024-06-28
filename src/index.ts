import type { FileInfo, API, Options } from 'jscodeshift';

const domains = [
  'https://cdn.polyfill.io',
  'https://polyfill.io',
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
      const regex = new RegExp(`${domain.replace(/\./g, '\\.')}[^"']*`, 'g'); // Match the domain and anything that follows it up to a " or '
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
      typeof path.node.value === 'string' && domains.some((domain) => path.node.value.includes(domain))
    ) {
      // Replace the old URL with the new URL
      path.node.value = newUrl;
    }
  });

  return root.toSource();
}

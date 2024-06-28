import { describe, it } from 'vitest';
import jscodeshift, { type API } from 'jscodeshift';
import transform from '../src/index.js';
import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const buildApi = (parser: string | undefined): API => ({
  j: parser ? jscodeshift.withParser(parser) : jscodeshift,
  jscodeshift: parser ? jscodeshift.withParser(parser) : jscodeshift,
  stats: () => {
    console.error(
      'The stats function was called, which is not supported on purpose',
    );
  },
  report: () => {
    console.error(
      'The report function was called, which is not supported on purpose',
    );
  },
});

describe('JS/TS transformations', () => {
  it('basic use case', async () => {
    const INPUT = await readFile(join(__dirname, '..', '__testfixtures__/fixture1.input.ts'), 'utf-8');
    const OUTPUT = await readFile(join(__dirname, '..', '__testfixtures__/fixture1.output.ts'), 'utf-8');

    const actualOutput = transform({
        path: 'index.ts',
        source: INPUT,
      },
      buildApi('tsx'),
    );

    assert.deepEqual(
      actualOutput?.replace(/\s/gm, ''),
      OUTPUT.replace(/\s/gm, ''),
    );
  });

  it('support multiple domains', async () => {
    const INPUT = await readFile(join(__dirname, '..', '__testfixtures__/fixture2.input.ts'), 'utf-8');
    const OUTPUT = await readFile(join(__dirname, '..', '__testfixtures__/fixture2.output.ts'), 'utf-8');

    const actualOutput = transform({
        path: 'index.ts',
        source: INPUT,
      },
      buildApi('tsx'),
    );

    assert.deepEqual(
      actualOutput?.replace(/\s/gm, ''),
      OUTPUT.replace(/\s/gm, ''),
    );
  });
});

describe('HTML transformations', () => {
  it('support HTML', async () => {
    const INPUT = await readFile(join(__dirname, '..', '__testfixtures__/fixture3.input.html'), 'utf-8');
    const OUTPUT = await readFile(join(__dirname, '..', '__testfixtures__/fixture3.output.html'), 'utf-8');

    const actualOutput = transform({
        path: 'index.html',
        source: INPUT,
      },
      buildApi(undefined), // No parser needed for HTML
    );

    assert.deepEqual(
      actualOutput?.replace(/\s/gm, ''),
      OUTPUT.replace(/\s/gm, ''),
    );
  });
});

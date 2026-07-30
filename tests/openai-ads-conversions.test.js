import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const PIXEL_ID = 'LnhRQn59kxqu38wrKPxWNj';
const pixelLoaderSource = fs.readFileSync(
  new URL('../src/scripts/analytics-consent-loader.js', import.meta.url),
  'utf8'
);
const contactFormSource = fs.readFileSync(
  new URL('../src/scripts/contact-form.js', import.meta.url),
  'utf8'
);
const baseLayoutSource = fs.readFileSync(
  new URL('../src/layouts/Base.astro', import.meta.url),
  'utf8'
);
const vercelConfig = JSON.parse(
  fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')
);

const createPixelContext = ({ privacySignal = false } = {}) => {
  const appendedScripts = [];
  const window = {
    navigator: {
      globalPrivacyControl: privacySignal,
      doNotTrack: privacySignal ? '1' : '0'
    },
    doNotTrack: privacySignal ? '1' : '0',
    location: { pathname: '/contact' },
    localStorage: {
      getItem() {
        return 'true';
      },
      setItem() {}
    },
    addEventListener() {}
  };
  const document = {
    currentScript: {
      dataset: {
        measurementId: '',
        openaiAdsPixelId: PIXEL_ID,
        consentKey: 'buckstrong:analytics-opt-in'
      }
    },
    title: 'Contact Buck Strong Garage Doors',
    head: {
      appendChild(script) {
        appendedScripts.push(script);
      }
    },
    getElementById() {
      return null;
    },
    createElement() {
      return {};
    }
  };
  const context = vm.createContext({
    window,
    document,
    Set,
    Date
  });

  return { context, window, appendedScripts };
};

test('OpenAI Ads Pixel initializes once and queues a page view after analytics consent', () => {
  const fixture = createPixelContext();

  vm.runInContext(pixelLoaderSource, fixture.context);
  vm.runInContext(pixelLoaderSource, fixture.context);

  assert.equal(fixture.appendedScripts.length, 1);
  assert.equal(fixture.appendedScripts[0].id, 'openai-ads-pixel-js');
  assert.equal(
    fixture.appendedScripts[0].src,
    'https://bzrcdn.openai.com/sdk/oaiq.min.js'
  );

  const calls = Array.from(fixture.window.oaiq.q, (args) =>
    Array.from(args, (value) => JSON.parse(JSON.stringify(value)))
  );

  assert.deepEqual(calls, [
    ['consent', true],
    ['init', { pixelId: PIXEL_ID }],
    [
      'measure',
      'page_viewed',
      {
        type: 'contents',
        contents: [
          {
            id: '/contact',
            name: 'Contact Buck Strong Garage Doors',
            content_type: 'page'
          }
        ]
      }
    ]
  ]);
});

test('OpenAI Ads Pixel stays disabled when browser privacy signals are present', () => {
  const fixture = createPixelContext({ privacySignal: true });

  vm.runInContext(pixelLoaderSource, fixture.context);

  assert.equal(fixture.appendedScripts.length, 0);
  assert.equal(fixture.window.oaiq, undefined);
});

test('contact form emits lead_created only inside the confirmed success branch', () => {
  assert.match(
    contactFormSource,
    /if \(response\.ok && result\?\.success\) \{[\s\S]*?trackOpenAiLead\(\);[\s\S]*?\} else \{/
  );
  assert.match(
    contactFormSource,
    /window\.oaiq\('measure', 'lead_created', \{\s*type: 'customer_action'\s*\}\)/
  );
});

test('production layout contains the Buck Strong pixel configuration', () => {
  assert.match(baseLayoutSource, new RegExp(PIXEL_ID));
  assert.match(baseLayoutSource, /data-openai-ads-pixel-id=\{openAiAdsPixelId\}/);
});

test('CSP allows the OpenAI Ads SDK, event endpoint, and pixel configuration', () => {
  const cspRule = vercelConfig.headers.find((entry) =>
    entry.headers?.some((header) => header.key === 'Content-Security-Policy')
  );
  const csp = cspRule?.headers.find(
    (header) => header.key === 'Content-Security-Policy'
  )?.value;

  assert.ok(csp, 'expected a Content-Security-Policy header');
  assert.match(csp, /script-src[^;]*https:\/\/bzrcdn\.openai\.com/);
  assert.match(csp, /connect-src[^;]*https:\/\/bzr\.openai\.com/);
  assert.match(csp, /connect-src[^;]*https:\/\/bzrcdn\.openai\.com/);
  assert.match(csp, /img-src[^;]*https:\/\/bzr\.openai\.com/);
});

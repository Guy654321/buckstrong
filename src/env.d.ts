/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  readonly PUBLIC_ANALYTICS_CONSENT_KEY?: string;
  readonly PUBLIC_VERCEL_OBSERVABILITY_BASEPATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

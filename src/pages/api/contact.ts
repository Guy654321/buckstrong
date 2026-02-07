import type { APIRoute } from 'astro';

import { contactRateLimiter } from '../../lib/rateLimiter';

export const prerender = false;

const REQUIRED_FIELDS = ['name', 'phone', 'zip', 'issue', 'consent'] as const;
const HONEYPOT_FIELD = 'company';
const FORM_LOADED_AT_FIELD = 'form_loaded_at';
const MIN_FORM_LOAD_AGE_MS = 1500;

const MESSAGE_URL_PATTERN = /(https?:\/\/|www\.)\S+/i;
const MAX_MESSAGE_LENGTH = 2000;

const ISSUE_LABELS: Record<string, string> = {
  'door-wont-open': "Door won't open",
  'door-wont-close': "Door won't close",
  'broken-spring': 'Broken spring',
  'opener-problems': 'Opener problems',
  'new-installation': 'New installation',
  maintenance: 'Maintenance/tune-up',
  other: 'Other'
};

const BUSINESS_EMAIL = 'hello@buckstronggaragedoors.com';

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

const DEFAULT_ALLOWED_HOSTS = [
  'derbystronggaragedoors.com',
  'www.derbystronggaragedoors.com',
  'localhost',
  '127.0.0.1'
];

const normalizeHostname = (host: string): string | null => {
  let normalized = host.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  normalized = normalized.replace(/^[a-z]+:\/\//i, '');
  normalized = normalized.replace(/\/.*$/, '');

  if (!normalized) {
    return null;
  }

  if (normalized.startsWith('[')) {
    const closingBracketIndex = normalized.indexOf(']');

    if (closingBracketIndex > 0) {
      normalized = normalized.slice(1, closingBracketIndex);
    }
  } else {
    const colonIndex = normalized.indexOf(':');

    if (colonIndex !== -1) {
      normalized = normalized.slice(0, colonIndex);
    }
  }

  normalized = normalized.trim();

  return normalized.length > 0 ? normalized : null;
};

interface AllowedHosts {
  exact: Set<string>;
  suffixes: Set<string>;
}

const buildAllowedHosts = (): AllowedHosts => {
  const exactHosts = new Set<string>();
  const suffixHosts = new Set<string>();

  for (const defaultHost of DEFAULT_ALLOWED_HOSTS) {
    const normalizedDefault = normalizeHostname(defaultHost);

    if (normalizedDefault) {
      exactHosts.add(normalizedDefault);
    }
  }

  const envHosts = (process.env.TURNSTILE_ALLOWED_HOSTS ?? '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean);

  for (const envHost of envHosts) {
    const wildcardCandidate = envHost.replace(/^[a-z]+:\/\//i, '');

    if (wildcardCandidate.startsWith('*.')) {
      const normalizedSuffixTarget = normalizeHostname(wildcardCandidate.slice(2));

      if (normalizedSuffixTarget) {
        suffixHosts.add(`.${normalizedSuffixTarget}`);
      }

      continue;
    }

    const normalizedEnvHost = normalizeHostname(envHost);

    if (normalizedEnvHost) {
      exactHosts.add(normalizedEnvHost);
    }
  }

  return { exact: exactHosts, suffixes: suffixHosts };
};

const ALLOWED_HOSTS = buildAllowedHosts();

const isAllowedTurnstileHostname = (hostname: string): boolean => {
  const normalizedHostname = normalizeHostname(hostname);

  if (!normalizedHostname) {
    return false;
  }

  if (ALLOWED_HOSTS.exact.has(normalizedHostname)) {
    return true;
  }

  for (const suffix of ALLOWED_HOSTS.suffixes) {
    if (normalizedHostname.endsWith(suffix) && normalizedHostname.length > suffix.length) {
      return true;
    }
  }

  return false;
};

const TURNSTILE_EXPECTED_ACTION = 'contact';
const MAX_TURNSTILE_TOKEN_AGE_MS = 2 * 60 * 1000;

const getTurnstileSecretKey = (): string => {
  const value = process.env.TURNSTILE_SECRET_KEY;
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '';
};

const isTurnstileConfigured = (): boolean => {
  const hasPublicSiteKey = (() => {
    const value = process.env.PUBLIC_TURNSTILE_SITE_KEY;

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return Boolean(value);
  })();

  return hasPublicSiteKey && getTurnstileSecretKey().length > 0;
};

const TURNSTILE_SECRET_KEY = getTurnstileSecretKey();
const TURNSTILE_ENABLED = isTurnstileConfigured();

const isTurnstileActiveForRequest = (request: Request): boolean => {
  if (!TURNSTILE_ENABLED) {
    return false;
  }

  try {
    const hostname = normalizeHostname(new URL(request.url).hostname);
    return hostname ? isAllowedTurnstileHostname(hostname) : TURNSTILE_ENABLED;
  } catch {
    return TURNSTILE_ENABLED;
  }
};

type RequiredField = (typeof REQUIRED_FIELDS)[number];

interface Submission {
  name: string;
  phone: string;
  email?: string;
  zip: string;
  issue: string;
  issueLabel: string;
  message?: string;
  consent: boolean;
  page?: string;
  submittedAt: string;
}

const getString = (formData: FormData, field: string): string => {
  const value = formData.get(field);
  return typeof value === 'string' ? value.trim() : '';
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildSubmission = (formData: FormData): Submission => {
  const issueValue = getString(formData, 'issue');
  const submission: Submission = {
    name: getString(formData, 'name'),
    phone: getString(formData, 'phone'),
    email: getString(formData, 'email') || undefined,
    zip: getString(formData, 'zip'),
    issue: issueValue,
    issueLabel: ISSUE_LABELS[issueValue] ?? issueValue,
    message: getString(formData, 'message') || undefined,
    consent: getString(formData, 'consent').toLowerCase() === 'on',
    page: getString(formData, 'page') || undefined,
    submittedAt: new Date().toISOString()
  };

  return submission;
};

const validateSubmission = (submission: Submission): RequiredField[] => {
  return REQUIRED_FIELDS.filter((field) => {
    if (field === 'consent') {
      return !submission.consent;
    }

    const value = submission[field];

    if (typeof value !== 'string') {
      return true;
    }

    return value.length === 0;
  });
};

const containsUrl = (value?: string): boolean => {
  if (!value) {
    return false;
  }

  return MESSAGE_URL_PATTERN.test(value);
};

const isMessageTooLong = (value?: string): boolean => {
  if (!value) {
    return false;
  }

  return value.length > MAX_MESSAGE_LENGTH;
};

const isMalformedPhoneNumber = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  return digits.length < 10 || digits.length > 15;
};

const createTextBody = (submission: Submission): string => {
  return [
    'New contact form submission from Buck Strong Garage Doors',
    `Received at: ${submission.submittedAt}`,
    submission.page ? `Source page: ${submission.page}` : null,
    '',
    `Name: ${submission.name}`,
    `Phone: ${submission.phone}`,
    `Email: ${submission.email ?? 'Not provided'}`,
    `ZIP Code: ${submission.zip}`,
    `Issue: ${submission.issueLabel}`,
    '',
    'Message:',
    submission.message ?? 'No additional details provided.',
    '',
    `Consent to contact: ${submission.consent ? 'Yes' : 'No'}`
  ]
    .filter((line) => line !== null)
    .join('\n');
};

const createHtmlBody = (submission: Submission, textBody: string): string => {
  const formattedMessage = submission.message
    ? `<p style="white-space: pre-wrap; margin: 0;">${escapeHtml(submission.message)}</p>`
    : '<p style="margin: 0;">No additional details provided.</p>';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>New contact form submission</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0E121B;">
    <h1 style="font-size: 1.25rem; margin-bottom: 1rem;">New contact form submission</h1>
    <p style="margin: 0 0 0.5rem 0;">Received at: <strong>${escapeHtml(submission.submittedAt)}</strong></p>
    ${
      submission.page
        ? `<p style="margin: 0 0 0.5rem 0;">Source page: <a href="${escapeHtml(
            submission.page
          )}">${escapeHtml(submission.page)}</a></p>`
        : ''
    }
    <table style="border-collapse: collapse; margin-top: 1rem;">
      <tbody>
        <tr>
          <td style="padding: 0.25rem 0.75rem 0.25rem 0; font-weight: 600;">Name</td>
          <td style="padding: 0.25rem 0;">${escapeHtml(submission.name)}</td>
        </tr>
        <tr>
          <td style="padding: 0.25rem 0.75rem 0.25rem 0; font-weight: 600;">Phone</td>
          <td style="padding: 0.25rem 0;">${escapeHtml(submission.phone)}</td>
        </tr>
        <tr>
          <td style="padding: 0.25rem 0.75rem 0.25rem 0; font-weight: 600;">Email</td>
          <td style="padding: 0.25rem 0;">${escapeHtml(submission.email ?? 'Not provided')}</td>
        </tr>
        <tr>
          <td style="padding: 0.25rem 0.75rem 0.25rem 0; font-weight: 600;">ZIP Code</td>
          <td style="padding: 0.25rem 0;">${escapeHtml(submission.zip)}</td>
        </tr>
        <tr>
          <td style="padding: 0.25rem 0.75rem 0.25rem 0; font-weight: 600;">Issue</td>
          <td style="padding: 0.25rem 0;">${escapeHtml(submission.issueLabel)}</td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 1.5rem;">
      <h2 style="font-size: 1rem; margin-bottom: 0.5rem;">Additional details</h2>
      ${formattedMessage}
    </div>
    <p style="margin-top: 1.5rem;">Consent to contact: <strong>${submission.consent ? 'Yes' : 'No'}</strong></p>
    <pre style="background: #f4f6f8; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.75rem; color: #334155; white-space: pre-wrap;">${escapeHtml(textBody)}</pre>
  </body>
</html>`;
};

const deliverWithResend = async (submission: Submission, textBody: string, htmlBody: string): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = process.env.CONTACT_FORM_RECIPIENT ?? BUSINESS_EMAIL;
  const fromAddress = process.env.CONTACT_FORM_FROM ?? 'Buck Strong Garage Doors <hello@buckstronggaragedoors.com>';

  if (!apiKey || !recipients) {
    throw new Error('Resend integration is not configured.');
  }

  const to = recipients
    .split(',')
    .map((recipient) => recipient.trim())
    .filter(Boolean);

  if (to.length === 0) {
    throw new Error('At least one recipient email must be provided in CONTACT_FORM_RECIPIENT.');
  }

  const payload: Record<string, unknown> = {
    from: fromAddress,
    to,
    subject: submission.issueLabel
      ? `New service request: ${submission.issueLabel} from ${submission.name}`
      : `New contact form submission from ${submission.name}`,
    text: textBody,
    html: htmlBody
  };

  if (submission.email) {
    payload.reply_to = submission.email;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }
};

const deliverToWebhook = async (submission: Submission, textBody: string, htmlBody: string): Promise<void> => {
  const webhookUrl = process.env.CONTACT_FORM_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error('Webhook URL is not configured.');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ submission, textBody, htmlBody })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Webhook request failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const honeypotValue = getString(formData, HONEYPOT_FIELD);
    const formLoadedAtValue = getString(formData, FORM_LOADED_AT_FIELD);
    const formLoadedAtTime = formLoadedAtValue ? Date.parse(formLoadedAtValue) : Number.NaN;
    const now = Date.now();

    if (honeypotValue.length > 0) {
      return new Response(null, { status: 204 });
    }

    if (
      !formLoadedAtValue ||
      Number.isNaN(formLoadedAtTime) ||
      formLoadedAtTime > now ||
      now - formLoadedAtTime < MIN_FORM_LOAD_AGE_MS
    ) {
      return new Response(null, { status: 204 });
    }

    if (getString(formData, 'bot-field')) {
      return new Response(JSON.stringify({ success: true, message: 'Submission received.' }), {
        status: 200,
        headers: JSON_HEADERS
      });
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0]?.trim() || cfConnectingIp || realIp || undefined;
    const turnstileActive = isTurnstileActiveForRequest(request);

    const rateLimitResult = await contactRateLimiter.limit(clientIp ?? 'unknown');

    if (!rateLimitResult.allowed) {
      const retryAfter = Math.max(1, rateLimitResult.reset);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Too many requests. Please wait a moment and try again.'
        }),
        {
          status: 429,
          headers: {
            ...JSON_HEADERS,
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
          }
        }
      );
    }

    if (turnstileActive) {
      const turnstileToken = formData.get('cf-turnstile-response');

      if (typeof turnstileToken !== 'string' || turnstileToken.length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Please confirm you are human'
          }),
          {
            status: 400,
            headers: JSON_HEADERS
          }
        );
      }

      const remoteIp = clientIp;

      try {
        const validationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            secret: TURNSTILE_SECRET_KEY,
            response: turnstileToken,
            ...(remoteIp ? { remoteip: remoteIp } : {})
          })
        });

        if (!validationResponse.ok) {
          console.error('Turnstile validation request failed:', validationResponse.status, validationResponse.statusText);

          return new Response(
            JSON.stringify({
              success: false,
              message: 'Please confirm you are human'
            }),
            {
              status: 400,
              headers: JSON_HEADERS
            }
          );
        }

        const validationResult = (await validationResponse.json()) as {
          success: boolean;
          messages?: string[];
          ['error-codes']?: string[];
          action?: string;
          hostname?: string;
          challenge_ts?: string;
        };

        if (!validationResult.success) {
          const errorCodes = validationResult['error-codes'] ?? [];

          if (errorCodes.length > 0) {
            console.warn('Turnstile validation unsuccessful with error codes:', errorCodes.join(', '));
          } else {
            console.warn('Turnstile validation unsuccessful without error codes.');
          }

          return new Response(
            JSON.stringify({
              success: false,
              message: 'Please confirm you are human'
            }),
            {
              status: 400,
              headers: JSON_HEADERS
            }
          );
        }

        if (!validationResult.hostname || !isAllowedTurnstileHostname(validationResult.hostname)) {
          console.warn(
            'Turnstile validation hostname mismatch:',
            validationResult.hostname,
            'Allowed hosts:',
            JSON.stringify({
              exact: Array.from(ALLOWED_HOSTS.exact),
              suffixes: Array.from(ALLOWED_HOSTS.suffixes)
            })
          );

          return new Response(
            JSON.stringify({
              success: false,
              message: 'Verification could not be completed. Please try again later.'
            }),
            {
              status: 400,
              headers: JSON_HEADERS
            }
          );
        }

        if (validationResult.action !== TURNSTILE_EXPECTED_ACTION) {
          console.warn(
            'Turnstile validation action mismatch:',
            validationResult.action,
            'Expected action:',
            TURNSTILE_EXPECTED_ACTION
          );

          return new Response(
            JSON.stringify({
              success: false,
              message: 'Verification could not be completed. Please try again later.'
            }),
            {
              status: 400,
              headers: JSON_HEADERS
            }
          );
        }

        const challengeTimestamp = validationResult.challenge_ts;

        if (!challengeTimestamp) {
          console.warn('Turnstile validation missing challenge timestamp.');

          return new Response(
            JSON.stringify({
              success: false,
              message: 'Verification could not be completed. Please try again later.'
            }),
            {
              status: 400,
              headers: JSON_HEADERS
            }
          );
        }

        const parsedChallengeTime = Date.parse(challengeTimestamp);

        if (Number.isNaN(parsedChallengeTime)) {
          console.warn('Turnstile validation returned an invalid challenge timestamp:', challengeTimestamp);

          return new Response(
            JSON.stringify({
              success: false,
              message: 'Verification could not be completed. Please try again later.'
            }),
            {
              status: 400,
              headers: JSON_HEADERS
            }
          );
        }

        const challengeAgeMs = Date.now() - parsedChallengeTime;

        if (challengeAgeMs < 0 || challengeAgeMs > MAX_TURNSTILE_TOKEN_AGE_MS) {
          console.warn('Turnstile validation token is stale. Age (ms):', challengeAgeMs);

          return new Response(
            JSON.stringify({
              success: false,
              message: 'Verification expired. Please refresh the page and try again.'
            }),
            {
              status: 400,
              headers: JSON_HEADERS
            }
          );
        }
      } catch (validationError) {
        console.error('Unexpected error during Turnstile validation:', validationError);

        return new Response(
          JSON.stringify({
            success: false,
            message: 'Verification could not be completed. Please try again later.'
          }),
          {
            status: 400,
            headers: JSON_HEADERS
          }
        );
      }
    }

    const submission = buildSubmission(formData);
    const missingFields = validateSubmission(submission);

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        }),
        {
          status: 400,
          headers: JSON_HEADERS
        }
      );
    }

    if (
      isMalformedPhoneNumber(submission.phone) ||
      containsUrl(submission.message) ||
      isMessageTooLong(submission.message)
    ) {
      console.warn('Contact form submission discarded due to validation rules.');

      return new Response(null, {
        status: 204
      });
    }

    const textBody = createTextBody(submission);
    const htmlBody = createHtmlBody(submission, textBody);

    const deliveryTargets: Array<() => Promise<void>> = [];

    if (process.env.RESEND_API_KEY) {
      deliveryTargets.push(() => deliverWithResend(submission, textBody, htmlBody));
    }

    if (process.env.CONTACT_FORM_WEBHOOK_URL) {
      deliveryTargets.push(() => deliverToWebhook(submission, textBody, htmlBody));
    }

    if (deliveryTargets.length === 0) {
      console.error(
        'Contact form submission received but no delivery target is configured. Set RESEND_API_KEY/CONTACT_FORM_RECIPIENT or CONTACT_FORM_WEBHOOK_URL.'
      );

      return new Response(
        JSON.stringify({
          success: false,
          message: 'The form is not configured to deliver submissions. Please contact us directly.'
        }),
        {
          status: 500,
          headers: JSON_HEADERS
        }
      );
    }

    const deliveryErrors: Error[] = [];

    for (const attempt of deliveryTargets) {
      try {
        await attempt();
      } catch (error) {
        if (error instanceof Error) {
          deliveryErrors.push(error);
          console.error('Contact form delivery failed:', error.message);
        } else {
          console.error('Contact form delivery failed with an unknown error.');
        }
      }
    }

    if (deliveryErrors.length === deliveryTargets.length) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'We could not deliver your request. Please try again later.'
        }),
        {
          status: 502,
          headers: JSON_HEADERS
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thanks! Your request has been sent. We will be in touch shortly.'
      }),
      {
        status: 200,
        headers: JSON_HEADERS
      }
    );
  } catch (error) {
    console.error('Unexpected error processing contact form submission:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Something went wrong while sending your request. Please try again.'
      }),
      {
        status: 500,
        headers: JSON_HEADERS
      }
    );
  }
};

import { z } from 'zod';

import { homeKitAccessoryName } from './regex.js';

import { textOneTimePasscode } from './regex.js';

/**
 * Lib - Schema - Fingerprint Identity.
 *
 * Reads only the browser identity needed to keep HTTP headers aligned with a
 * saved fingerprint; older saved fingerprints have this same shape.
 *
 * @since 3.5.0
 */
export const fingerprintIdentity = z.object({
  fingerprint: z.object({
    uaString: z.string().min(1),
    uaBrowser: z.object({
      name: z.string().nullable(),
      major: z.string().nullable(),
    }),
    uaPlatform: z.string().nullable(),
  }),
});

/**
 * Lib - Schema - Config UI Login.
 *
 * Guards the login form submitted through the plugin's custom config UI so region,
 * username, and password are checked before any request reaches the ADT Pulse portal.
 *
 * @since 1.0.0
 */
export const configUiLogin = z.object({
  subdomain: z.string()
    .min(1, 'Please select a region.')
    .refine((value) => [
      'portal',
      'portal-ca',
    ].includes(value), 'Please select a valid region.'),
  username: z.string()
    .min(1, 'Please enter your username.')
    .max(100, 'Your username is too long.'),
  password: z.string()
    .min(1, 'Please enter your password.')
    .max(300, 'Your password is too long.'),
});

/**
 * Lib - Schema - Config UI Login Response.
 *
 * Describes the payload the config UI expects back after a login attempt so it can
 * decide whether multi-factor verification is required and which methods to offer.
 *
 * @since 1.0.0
 */
export const configUiLoginResponse = z.object({
  info: z.object({
    methods: z.array(z.object({
      id: z.string(),
      type: z.union([
        z.literal('SMS'),
        z.literal('EMAIL'),
      ]),
      label: z.string(),
    })),
    status: z.union([
      z.literal('complete'),
      z.literal('not-required'),
    ]),
  }),
});

/**
 * Lib - Schema - Config UI Request Code.
 *
 * Ensures the config UI only asks the portal to send a verification code once the
 * user has actually picked one of the available multi-factor delivery methods.
 *
 * @since 1.0.0
 */
export const configUiRequestCode = z.object({
  methodId: z.string()
    .min(1, 'Please select a verification method.'),
});

/**
 * Lib - Schema - Config UI Validate Code.
 *
 * Checks the one-time passcode typed into the config UI so obviously malformed codes
 * are rejected locally instead of being sent to the portal for verification.
 *
 * @since 1.0.0
 */
export const configUiValidateCode = z.object({
  otpCode: z.string()
    .min(1, 'Please enter the verification code.')
    .refine((value) => textOneTimePasscode.test(value), 'Invalid verification code format.'),
});

/**
 * Lib - Schema - Config Server Login.
 *
 * Validates the login request body arriving at the config UI server endpoint, acting
 * as the server-side counterpart to the form checks performed in the browser.
 *
 * @since 1.0.0
 */
export const configServerLogin = z.object({
  subdomain: z.union([
    z.literal('portal'),
    z.literal('portal-ca'),
  ]),
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(300),
});

/**
 * Lib - Schema - Config Server Request Code.
 *
 * Validates the request-code body arriving at the config UI server endpoint so a
 * verification code is only requested for a properly identified delivery method.
 *
 * @since 1.0.0
 */
export const configServerRequestCode = z.object({
  methodId: z.string().min(1),
});

/**
 * Lib - Schema - Config Server Validate.
 *
 * Validates the final verification body arriving at the config UI server endpoint,
 * pairing the trusted device name with the passcode before the device is enrolled.
 *
 * @since 1.0.0
 */
export const configServerValidate = z.object({
  instanceName: z.string().max(500),
  otpCode: z.string().length(6).refine((value) => textOneTimePasscode.test(value)),
});

/**
 * Lib - Schema - Config Server Generate Config.
 *
 * Validates the generate-config request body arriving at the config UI server
 * endpoint so the old config object and update flag are checked before the server
 * attempts to read their properties.
 *
 * @since 1.0.0
 */
export const configServerGenerateConfig = z.object({
  oldConfig: z.record(z.string(), z.unknown()).default({}),
  updateSensors: z.boolean().optional(),
});

/**
 * Lib - Schema - Multi Factor Auth.
 *
 * Mirrors the multi-factor authentication state and command map returned by the ADT
 * Pulse portal, letting the plugin detect upstream response shape changes early.
 *
 * @since 1.0.0
 */
export const multiFactorAuth = z.object({
  state: z.object({
    mfaEnabled: z.boolean(),
    label: z.string(),
    numTrustedDevices: z.number().optional(),
    mfaProperties: z.array(z.object({
      id: z.string(),
      type: z.union([
        z.literal('SMS'),
        z.literal('EMAIL'),
      ]),
      label: z.string(),
      caption: z.string(),
    })),
    trustedDevices: z.array(z.object({
      id: z.string(),
      name: z.string(),
      label: z.string(),
    })).optional(),
  }),
  commands: z.record(z.string(), z.object({
    params: z.record(z.string(), z.object({
      label: z.string().optional(),
      options: z.array(z.object({
        value: z.string(),
        type: z.union([
          z.literal('SMS'),
          z.literal('EMAIL'),
        ]).optional(),
        label: z.string(),
        caption: z.string().optional(),
      })).optional(),
      type: z.union([
        z.literal('boolean'),
        z.literal('select'),
        z.literal('textInput'),
      ]),
    })),
    method: z.literal('POST'),
    action: z.string().startsWith('rest/adt/ui/client/multiFactorAuth/'),
    label: z.string(),
  })),
});

/**
 * Lib - Schema - Otp Response.
 *
 * Captures the status payload the portal returns after a one-time passcode request
 * or submission so callers can branch on the code and surface the detail message.
 *
 * @since 1.0.0
 */
export const otpResponse = z.object({
  code: z.number(),
  detail: z.string(),
});

/**
 * Lib - Schema - Platform Config.
 *
 * Validates the plugin's platform block from the Homebridge config.json at startup so
 * misconfigured credentials, modes, or sensors fail fast with clear messages.
 *
 * @since 1.0.0
 */
export const platformConfig = z.object({
  platform: z.literal('ADTPulse'),
  name: z.string().min(1).max(50),
  subdomain: z.union([
    z.literal('portal'),
    z.literal('portal-ca'),
  ]),
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(300),
  fingerprint: z.string().min(1).max(10240),
  mode: z.union([
    z.literal('normal'),
    z.literal('paused'),
    z.literal('reset'),
  ]),
  speed: z.union([
    z.literal(1),
    z.literal(0.75),
    z.literal(0.5),
    z.literal(0.25),
  ]),
  options: z.array(z.union([
    z.literal('disableAlarmRingingSwitch'),
    z.literal('ignoreSensorProblemStatus'),
  ])).default([]),
  sensors: z.array(z.object({
    name: z.string().max(50).refine(
      (value) => value === '' || homeKitAccessoryName.test(value),
      { message: 'Use at least two characters, start and end with a letter or number, and avoid emojis or unsupported symbols.' },
    ).transform((value) => (value === '') ? undefined : value).optional(),
    adtName: z.string().min(1).max(100),
    adtZone: z.number().min(1).max(99),
    adtType: z.union([
      z.literal('co'),
      z.literal('doorWindow'),
      z.literal('fire'),
      z.literal('flood'),
      z.literal('glass'),
      z.literal('heat'),
      z.literal('motion'),
      z.literal('shock'),
      z.literal('temperature'),
    ]),
  })).min(0).max(147).default([]),
});

import { z } from 'zod';

/**
 * Config ui login.
 *
 * @since 1.0.0
 */
export const configUiLogin = z.object({
  subdomain: z.string()
    .min(1, 'Please select a region.')
    .refine((value) => ['portal', 'portal-ca'].includes(value), 'Please select a valid region.'),
  username: z.string()
    .min(1, 'Please enter your username.')
    .max(100, 'Your username is too long.'),
  password: z.string()
    .min(1, 'Please enter your password.')
    .max(300, 'Your password is too long.'),
});

/**
 * Config ui login response.
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
 * Config ui request code.
 *
 * @since 1.0.0
 */
export const configUiRequestCode = z.object({
  methodId: z.string()
    .min(1, 'Please select a verification method.'),
});

/**
 * Config ui validate code.
 *
 * @since 1.0.0
 */
export const configUiValidateCode = z.object({
  otpCode: z.string()
    .min(1, 'Please enter the verification code.')
    .refine((value) => /^[0-9]{6}$/.test(value), 'Invalid verification code format.'),
});

/**
 * Config server login.
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
 * Config server request code.
 *
 * @since 1.0.0
 */
export const configServerRequestCode = z.object({
  methodId: z.string().min(1),
});

/**
 * Config server validate.
 *
 * @since 1.0.0
 */
export const configServerValidate = z.object({
  deviceName: z.string().min(1).max(100),
  otpCode: z.string().length(6),
});

/**
 * Multi factor auth.
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
 * Otp response.
 *
 * @since 1.0.0
 */
export const otpResponse = z.object({
  code: z.number(),
  detail: z.string(),
});

/**
 * Platform config.
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
    name: z.string().min(1).max(50).optional(),
    adtName: z.string().min(1).max(100),
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
    adtZone: z.number().min(1).max(99),
  })).min(0).max(148).default([]),
});

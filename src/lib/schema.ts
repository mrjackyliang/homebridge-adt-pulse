import z from 'zod';

/**
 * Platform config.
 *
 * @since 1.0.0
 */
export const platformConfig = z.object({
  platform: z.literal('ADTPulse'),
  name: z.string().optional(),
  subdomain: z.union([
    z.literal('portal'),
    z.literal('portal-ca'),
  ]),
  username: z.string().min(1),
  password: z.string().min(1),
  fingerprint: z.string().min(1),
  sensors: z.array(z.object({
    name: z.string().optional(),
    adtName: z.string().min(1),
    adtType: z.union([
      z.literal('co'),
      z.literal('door'),
      z.literal('fire'),
      z.literal('glass'),
      z.literal('motion'),
      z.literal('window'),
    ]),
    adtZone: z.number().finite(),
  })).min(1),
  debug: z.boolean().optional(),
  reset: z.boolean().optional(),
});

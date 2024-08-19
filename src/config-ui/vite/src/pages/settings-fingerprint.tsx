import React from 'react';

import FingerprintTable from '@/config-ui/vite/src/components/fingerprint-table.js';
import type { SettingsFingerprintProps } from '@/types/config-ui.d.ts';

/**
 * Settings fingerprint.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function SettingsFingerprint(props: SettingsFingerprintProps) {
  const { fingerprint } = props;

  if (fingerprint !== '' || import.meta.env.DEV) {
    return (
      <>
        <p className="help-block">This section allows you to explore the contents of the randomly generated browser fingerprint used with your account. If you would like to refresh your fingerprint, re-run the setup wizard located in the &quot;System&quot; tab.</p>
        <FingerprintTable fingerprint={fingerprint} />
      </>
    );
  }

  return null;
}

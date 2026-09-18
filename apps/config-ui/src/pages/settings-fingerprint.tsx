import React from 'react';

import FingerprintTable from '../components/fingerprint-table';

import type { SettingsFingerprintProps, SettingsFingerprintProps_Fingerprint } from '../types/config-ui.d.ts';

/**
 * Pages - Settings Fingerprint - Settings Fingerprint.
 *
 * Renders the settings page section that lets users inspect the browser
 * fingerprint tied to their account, delegating the display of its
 * contents to the fingerprint table component.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SettingsFingerprint(props: SettingsFingerprintProps) {
  const fingerprint: SettingsFingerprintProps_Fingerprint = props['fingerprint'];

  if (fingerprint !== '' || import.meta.env.DEV === true) {
    return (
      <>
        <p className="help-block">This section allows you to explore the contents of the randomly generated browser fingerprint used with your account. If you would like to refresh your fingerprint, re-run the setup wizard located in the &quot;System&quot; tab.</p>
        <FingerprintTable fingerprint={fingerprint} />
      </>
    );
  }

  return null;
}

export default SettingsFingerprint;

import React from 'react';

import CompleteLogo from '@/config-ui/vite/src/assets/complete-logo.png';
import { styles } from '@/config-ui/vite/src/styles/pages/setup-complete.js';
import type { SetupCompleteOnSubmitReturns, SetupCompleteProps } from '@/types/config-ui.d.ts';

/**
 * Setup complete.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function SetupComplete(props: SetupCompleteProps) {
  const { homebridge, updateSensors } = props;

  /**
   * Setup complete - On submit.
   *
   * @returns {SetupCompleteOnSubmitReturns}
   *
   * @since 1.0.0
   */
  const onSubmit = async (): SetupCompleteOnSubmitReturns => {
    if (homebridge === undefined) {
      return;
    }

    // Disable the user interface.
    homebridge.showSpinner();

    const configs = await homebridge.getPluginConfig();
    const config = configs[0];
    const generateConfigResponse = await homebridge.request('/generate-config', {
      oldConfig: config,
      updateSensors,
    });

    // Update and save Homebridge config.
    await homebridge.updatePluginConfig([generateConfigResponse.info.config]);
    await homebridge.savePluginConfig();

    // Close the settings modal.
    homebridge.closeSettings();
  };

  return (
    <div className="text-center">
      <img src={CompleteLogo} className="mb-3" style={styles} alt="Setup Complete" />
      <h2 className="fw-semibold lh-2">Setup Complete</h2>
      <p className="lead">Restart Homebridge to apply your configuration changes.</p>
      <button type="button" className="btn btn-primary" onClick={() => onSubmit()}>Save and Close</button>
    </div>
  );
}

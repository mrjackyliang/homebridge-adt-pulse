import React from 'react';

import CompleteLogo from '../assets/complete-logo.png';
import { styles } from '../styles/pages/setup-complete.js';

import type {
  SetupCompleteOnSubmit,
  SetupCompleteOnSubmitConfig,
  SetupCompleteOnSubmitConfigs,
  SetupCompleteOnSubmitGenerateConfigResponse,
  SetupCompleteOnSubmitReturns,
  SetupCompleteProps,
  SetupCompleteProps_Homebridge,
  SetupCompleteProps_UpdateSensors,
} from '../types/config-ui.d.ts';

/**
 * Pages - Setup Complete - Setup Complete.
 *
 * Renders the final screen of the plugin setup flow so the user can persist
 * the generated configuration into Homebridge and close the settings modal.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SetupComplete(props: SetupCompleteProps) {
  const homebridge: SetupCompleteProps_Homebridge = props['homebridge'];
  const updateSensors: SetupCompleteProps_UpdateSensors = props['updateSensors'];

  /**
   * Pages - Setup Complete - Setup Complete - On Submit.
   *
   * Generates the finished plugin configuration, writes it back into the
   * Homebridge config, then closes the settings modal to end the setup flow.
   *
   * @returns {SetupCompleteOnSubmitReturns}
   *
   * @since 1.0.0
   */
  const onSubmit: SetupCompleteOnSubmit = async (): SetupCompleteOnSubmitReturns => {
    if (homebridge === undefined) {
      return;
    }

    // Disable the user interface.
    homebridge.showSpinner();

    try {
      const configs: SetupCompleteOnSubmitConfigs = await homebridge.getPluginConfig();
      const config: SetupCompleteOnSubmitConfig = configs[0] ?? {};
      const generateConfigResponse: SetupCompleteOnSubmitGenerateConfigResponse = await homebridge.request('/generate-config', {
        oldConfig: config,
        updateSensors,
      });

      if (generateConfigResponse.success === false) {
        console.error('Failed to generate config:', generateConfigResponse.info);

        return;
      }

      // Update the Homebridge config.
      await homebridge.updatePluginConfig([generateConfigResponse.info.config]);

      // Save the Homebridge config.
      await homebridge.savePluginConfig();

      // Close the settings modal.
      homebridge.closeSettings();
    } catch (error) {
      console.error('Failed to complete setup:', error);
    } finally {
      homebridge.hideSpinner();
    }

    return;
  };

  return (
    <div className="text-center">
      <img src={CompleteLogo} className="mb-3" style={styles['image']} alt="Setup Complete" />
      <h2 className="fw-semibold lh-2">Setup Complete</h2>
      <p className="lead">Restart Homebridge to apply your configuration changes.</p>
      <button type="button" className="btn btn-primary" onClick={() => onSubmit()}>Save and Close</button>
    </div>
  );
}

export default SetupComplete;

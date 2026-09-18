import React, { useEffect, useState } from 'react';

import type {
  SettingsClassicProps,
  SettingsClassicProps_Homebridge,
  SettingsClassicProps_SetView,
  SettingsClassicReady,
  SettingsClassicReadyState,
  SettingsClassicSetReady,
} from '../types/config-ui.d.ts';

/**
 * Pages - Settings Classic - Settings Classic.
 *
 * Displays the Homebridge schema-based settings form as a fallback for users
 * who prefer the classic editing experience, and offers a button to switch
 * back to the modern settings view once the form is ready.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SettingsClassic(props: SettingsClassicProps) {
  const homebridge: SettingsClassicProps_Homebridge = props['homebridge'];
  const setView: SettingsClassicProps_SetView = props['setView'];

  const readyState: SettingsClassicReadyState = useState<SettingsClassicReady>(false);
  const ready: SettingsClassicReady = readyState[0];
  const setReady: SettingsClassicSetReady = readyState[1];

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        return;
      }

      homebridge.showSpinner();

      // Making sure the UI does not randomly flash.
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);

        return;
      });

      // In case the previous view was modern settings.
      homebridge.showSchemaForm();

      // Once the schema form shows, set the view to "ready".
      setReady(true);

      homebridge.hideSpinner();

      return;
    })();

    return;
  }, [
    homebridge,
    setReady,
  ]);

  if (ready === true) {
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setView('settings')}
      >
        Back to Modern View
      </button>
    );
  }

  return null;
}

export default SettingsClassic;

import React, { useEffect, useState } from 'react';

import type { SettingsClassicProps } from '@/types/config-ui.d.ts';

/**
 * Settings classic.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function SettingsClassic(props: SettingsClassicProps) {
  const { homebridge, setView } = props;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        return;
      }

      homebridge.showSpinner();

      // Making sure the UI does not randomly flash.
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      // In case the previous view was modern settings.
      homebridge.showSchemaForm();

      // Once the schema form shows, set the view to "ready".
      setReady(true);

      homebridge.hideSpinner();
    })();
  }, []);

  if (ready) {
    return (
      <button
        type="button"
        className="btn btn-primary ml-0"
        onClick={() => setView('settings')}
      >
        Back to Modern View
      </button>
    );
  }

  return null;
}

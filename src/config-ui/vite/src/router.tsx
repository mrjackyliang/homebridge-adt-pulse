import React, { useEffect, useState } from 'react';

import ScreenToggle from '@/config-ui/vite/src/components/screen-toggle.js';
import Settings from '@/config-ui/vite/src/pages/settings.js';
import Setup from '@/config-ui/vite/src/pages/setup.js';
import type { RouterProps, RouterView } from '@/types/config-ui.d.ts';

/**
 * Router.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function Router(props: RouterProps) {
  const { homebridge } = props;

  const [view, setView] = useState<RouterView>();

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        return;
      }

      const configs = await homebridge.getPluginConfig();

      // If plugin is not configured, show the setup screen.
      if (configs.length === 0) {
        setView('setup');
      } else {
        // setView('settings');
        homebridge.showSchemaForm(); // TODO Will be replaced in a future version.
      }
    })();
  }, [homebridge]);

  return (
    <ScreenToggle view={view} setView={setView}>
      {(view === 'settings') ? (
        <Settings homebridge={homebridge} setView={setView} />
      ) : null}
      {(view === 'setup') ? (
        <Setup homebridge={homebridge} />
      ) : null}
    </ScreenToggle>
  );
}

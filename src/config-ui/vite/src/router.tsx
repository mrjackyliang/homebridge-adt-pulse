import React, { useEffect, useState } from 'react';

import ScreenToggle from '@/config-ui/vite/src/components/screen-toggle';
import Settings from '@/config-ui/vite/src/pages/settings';
import SettingsClassic from '@/config-ui/vite/src/pages/settings-classic';
import Setup from '@/config-ui/vite/src/pages/setup';
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
        setView('settings');
      }
    })();
  }, [homebridge]);

  return (
    <ScreenToggle view={view} setView={setView}>
      {(view === 'settings') ? (
        <Settings homebridge={homebridge} setView={setView} />
      ) : null}
      {(view === 'settings-classic') ? (
        <SettingsClassic homebridge={homebridge} setView={setView} />
      ) : null}
      {(view === 'setup') ? (
        <Setup homebridge={homebridge} />
      ) : null}
    </ScreenToggle>
  );
}

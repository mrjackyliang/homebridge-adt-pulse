import React, { useEffect, useState } from 'react';

import ScreenToggle from './components/screen-toggle';
import Settings from './pages/settings';
import SettingsClassic from './pages/settings-classic';
import Setup from './pages/setup';

import type {
  RouterConfigs,
  RouterProps,
  RouterProps_Homebridge,
  RouterSetView,
  RouterView,
  RouterViewState,
} from './types/config-ui.d.ts';

/**
 * Router.
 *
 * Decides which top-level screen the plugin UI should render by checking
 * whether a plugin configuration already exists, then routes the user to
 * either the first-time setup flow or the settings screens.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function Router(props: RouterProps) {
  const homebridge: RouterProps_Homebridge = props['homebridge'];

  const viewState: RouterViewState = useState<RouterView>();
  const view: RouterView = viewState[0];
  const setView: RouterSetView = viewState[1];

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        return;
      }

      const configs: RouterConfigs = await homebridge.getPluginConfig();

      // If plugin is not configured, show the setup screen.
      if (configs.length === 0) {
        setView('setup');
      } else {
        setView('settings');
      }

      return;
    })();

    return;
  }, [
    homebridge,
    setView,
  ]);

  return (
    <ScreenToggle homebridge={homebridge} view={view} setView={setView}>
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

export default Router;

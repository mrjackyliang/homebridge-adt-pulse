import React, { useEffect, useState } from 'react';

import type {
  ScreenToggleBackground,
  ScreenToggleMount,
  ScreenToggleProps,
  ScreenToggleProps_Children,
  ScreenToggleProps_Homebridge,
  ScreenToggleProps_SetView,
  ScreenToggleProps_View,
  ScreenToggleRoot,
  ScreenToggleSetTheme,
  ScreenToggleTheme,
  ScreenToggleThemeState,
} from '../types/config-ui.d.ts';

/**
 * Components - Screen Toggle - Screen Toggle.
 *
 * Wraps the plugin screens so standalone previews get a navbar for switching
 * Bootstrap themes and views, while Homebridge renders children as-is.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function ScreenToggle(props: ScreenToggleProps) {
  const children: ScreenToggleProps_Children = props['children'];
  const homebridge: ScreenToggleProps_Homebridge = props['homebridge'];
  const setView: ScreenToggleProps_SetView = props['setView'];
  const view: ScreenToggleProps_View = props['view'];

  const themeState: ScreenToggleThemeState = useState<ScreenToggleTheme>('light');
  const theme: ScreenToggleTheme = themeState[0];
  const setTheme: ScreenToggleSetTheme = themeState[1];

  useEffect(() => {
    if (homebridge === undefined) {
      const root: ScreenToggleRoot = document.getElementById('root');

      if (root !== null && root.shadowRoot !== null) {
        const mount: ScreenToggleMount = root.shadowRoot.querySelector('.adt-pulse-app');

        if (mount !== null) {
          mount.setAttribute('data-bs-theme', theme);
        }
      }
    }

    return;
  }, [
    homebridge,
    theme,
  ]);

  // Standalone previews have an extra screen toggle.
  if (homebridge === undefined) {
    const background: ScreenToggleBackground = (theme === 'dark') ? 'bg-secondary navbar-dark' : 'bg-light navbar-light';

    return (
      <>
        <nav className={`navbar ${background}`}>
          <div className="container-fluid d-flex flex-wrap gap-2">
            <span className="navbar-brand">ADT Pulse for Homebridge</span>
            <div className="d-flex flex-wrap gap-2">
              <div className="btn-group" role="group" aria-label="Preview theme">
                <button type="button" className={(theme === 'light') ? 'btn btn-primary' : 'btn btn-outline-secondary'} onClick={() => setTheme('light')}>Light</button>
                <button type="button" className={(theme === 'dark') ? 'btn btn-primary' : 'btn btn-outline-secondary'} onClick={() => setTheme('dark')}>Dark</button>
              </div>
              <div className="btn-group" role="group" aria-label="Preview screen">
                <button type="button" className={(view === 'settings') ? 'btn btn-primary' : 'btn btn-outline-secondary'} onClick={() => setView('settings')}>Settings</button>
                <button type="button" className={(view === 'setup') ? 'btn btn-primary' : 'btn btn-outline-secondary'} onClick={() => setView('setup')}>Setup</button>
              </div>
            </div>
          </div>
        </nav>
        <section className="p-3">
          {children}
        </section>
      </>
    );
  }

  return children;
}

export default ScreenToggle;

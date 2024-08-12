import React, { useEffect, useState } from 'react';

import type { ScreenToggleProps } from '@/types/config-ui.d.ts';

/**
 * Screen toggle.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function ScreenToggle(props: ScreenToggleProps) {
  const { children, view, setView } = props;

  const [background, setBackground] = useState('bg-light');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);

    // Sync the rest of the Bootstrap theme.
    switch (theme) {
      case 'dark':
        setBackground('bg-secondary');
        break;
      case 'light':
      default:
        setBackground('bg-light');
        break;
    }
  }, [theme]);

  // Development mode has an extra screen toggle.
  if (import.meta.env.DEV) {
    return (
      <>
        <nav className={`navbar navbar-expand-lg navbar-light ${background}`}>
          <div className="container-fluid">
            <a href="/" className="navbar-brand">ADT Pulse for Homebridge</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbar">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item dropdown">
                  <button type="button" className="nav-link dropdown-toggle" id="navbar-dropdown-theme" data-bs-toggle="dropdown" aria-expanded="false">Theme</button>
                  <ul className="dropdown-menu" aria-labelledby="navbar-dropdown-theme">
                    <li>
                      <button type="button" className={(theme === 'light') ? 'dropdown-item active' : 'dropdown-item'} onClick={() => setTheme('light')}>Light</button>
                    </li>
                    <li>
                      <button type="button" className={(theme === 'dark') ? 'dropdown-item active' : 'dropdown-item'} onClick={() => setTheme('dark')}>Dark</button>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <button type="button" className="nav-link dropdown-toggle" id="navbar-dropdown-screen" data-bs-toggle="dropdown" aria-expanded="false">Switch Screen</button>
                  <ul className="dropdown-menu" aria-labelledby="navbar-dropdown-screen">
                    <li>
                      <button type="button" className={(view === 'settings') ? 'dropdown-item active' : 'dropdown-item'} onClick={() => setView('settings')}>Settings</button>
                    </li>
                    <li>
                      <button type="button" className={(view === 'setup') ? 'dropdown-item active' : 'dropdown-item'} onClick={() => setView('setup')}>Setup</button>
                    </li>
                  </ul>
                </li>
              </ul>
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

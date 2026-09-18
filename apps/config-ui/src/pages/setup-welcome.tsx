import React from 'react';

import SetupLogo from '../assets/setup-logo.png';
import { styles } from '../styles/pages/setup-welcome.js';

import type { SetupWelcomeProps, SetupWelcomeProps_SetCurrentPage } from '../types/config-ui.d.ts';

/**
 * Pages - Setup Welcome - Setup Welcome.
 *
 * Serves as the landing page of the plugin setup wizard, greeting the user
 * with the plugin branding and a button that advances the wizard to the
 * next configuration step.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SetupWelcome(props: SetupWelcomeProps) {
  const setCurrentPage: SetupWelcomeProps_SetCurrentPage = props['setCurrentPage'];

  return (
    <div className="text-center">
      <img src={SetupLogo} className="my-3" style={styles['image']} alt="ADT Pulse for Homebridge" />
      <h2 className="fw-light my-2">Welcome to</h2>
      <h2 className="fw-semibold my-2">ADT Pulse</h2>
      <p className="lead my-2">Homebridge plugin for ADT Pulse Security System</p>
      <button type="button" className="btn btn-primary my-2" onClick={() => setCurrentPage((previousPage) => previousPage + 1)}>Begin Setup</button>
    </div>
  );
}

export default SetupWelcome;

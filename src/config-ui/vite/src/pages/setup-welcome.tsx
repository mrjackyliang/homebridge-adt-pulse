import React from 'react';

import SetupLogo from '@/config-ui/vite/src/assets/setup-logo.png';
import { styles } from '@/config-ui/vite/src/styles/pages/setup-welcome.js';
import type { SetupWelcomeProps } from '@/types/config-ui.d.ts';

/**
 * Setup welcome.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function SetupWelcome(props: SetupWelcomeProps) {
  const { setCurrentPage } = props;

  return (
    <div className="text-center">
      <img src={SetupLogo} className="my-3" style={styles.image} alt="ADT Pulse for Homebridge" />
      <h2 className="fw-light my-2">Welcome to</h2>
      <h2 className="fw-semibold my-2">ADT Pulse</h2>
      <p className="lead my-2">Homebridge plugin for ADT Pulse Security System</p>
      <button type="button" className="btn btn-primary my-2" onClick={() => setCurrentPage((previousPage) => previousPage + 1)}>Begin Setup</button>
    </div>
  );
}

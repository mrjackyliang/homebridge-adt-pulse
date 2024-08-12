import React, { useState } from 'react';

import SetupComplete from '@/config-ui/vite/src/pages/setup-complete.js';
import SetupLogin from '@/config-ui/vite/src/pages/setup-login.js';
import SetupRequestCode from '@/config-ui/vite/src/pages/setup-request-code.js';
import SetupSensors from '@/config-ui/vite/src/pages/setup-sensors.js';
import SetupValidate from '@/config-ui/vite/src/pages/setup-validate.js';
import SetupWelcome from '@/config-ui/vite/src/pages/setup-welcome.js';
import type { SetupAvailableMethods, SetupProps } from '@/types/config-ui.d.ts';

/**
 * Setup.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function Setup(props: SetupProps) {
  const { homebridge } = props;

  const [currentPage, setCurrentPage] = useState(0);
  const [availableMethods, setAvailableMethods] = useState<SetupAvailableMethods>([]);
  const [selectedMethod, setSelectedMethod] = useState('unknown');
  const [updateSensors, setUpdateSensors] = useState(false);

  return (
    <div className="tab-content" id="setup-tab-content">
      <div className={((currentPage === 0) ? 'tab-pane show active' : 'tab-pane')} id="setup-welcome" role="tabpanel" aria-labelledby="setup-welcome-tab">
        <SetupWelcome
          setCurrentPage={setCurrentPage}
        />
      </div>
      <div className={((currentPage === 1) ? 'tab-pane show active' : 'tab-pane')} id="setup-login" role="tabpanel" aria-labelledby="setup-login-tab">
        <SetupLogin
          homebridge={homebridge}
          setAvailableMethods={setAvailableMethods}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <div className={((currentPage === 2) ? 'tab-pane show active' : 'tab-pane')} id="setup-request-code" role="tabpanel" aria-labelledby="setup-request-code-tab">
        <SetupRequestCode
          homebridge={homebridge}
          availableMethods={availableMethods}
          setCurrentPage={setCurrentPage}
          setSelectedMethod={setSelectedMethod}
        />
      </div>
      <div className={((currentPage === 3) ? 'tab-pane show active' : 'tab-pane')} id="setup-validate" role="tabpanel" aria-labelledby="setup-validate-tab">
        <SetupValidate
          homebridge={homebridge}
          selectedMethod={selectedMethod}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <div className={((currentPage === 4) ? 'tab-pane show active' : 'tab-pane')} id="setup-sensors" role="tabpanel" aria-labelledby="setup-sensors-tab">
        <SetupSensors
          homebridge={homebridge}
          setCurrentPage={setCurrentPage}
          setUpdateSensors={setUpdateSensors}
        />
      </div>
      <div className={((currentPage === 5) ? 'tab-pane show active' : 'tab-pane')} id="setup-complete" role="tabpanel" aria-labelledby="setup-complete-tab">
        <SetupComplete
          homebridge={homebridge}
          updateSensors={updateSensors}
        />
      </div>
    </div>
  );
}

import React, { useState } from 'react';

import SetupComplete from './setup-complete';
import SetupLogin from './setup-login';
import SetupRequestCode from './setup-request-code';
import SetupSensors from './setup-sensors';
import SetupValidate from './setup-validate';
import SetupWelcome from './setup-welcome';

import type {
  SetupAvailableMethods,
  SetupAvailableMethodsState,
  SetupCurrentPage,
  SetupCurrentPageState,
  SetupProps,
  SetupProps_Homebridge,
  SetupSelectedMethod,
  SetupSelectedMethodState,
  SetupSetAvailableMethods,
  SetupSetCurrentPage,
  SetupSetSelectedMethod,
  SetupSetUpdateSensors,
  SetupUpdateSensors,
  SetupUpdateSensorsState,
} from '../types/config-ui.d.ts';

/**
 * Pages - Setup.
 *
 * Coordinates the multi-step setup wizard by tracking the active page and the
 * state shared between steps, showing only the pane that matches the current
 * stage of the onboarding flow.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function Setup(props: SetupProps) {
  const homebridge: SetupProps_Homebridge = props['homebridge'];

  const currentPageState: SetupCurrentPageState = useState<SetupCurrentPage>(0);
  const currentPage: SetupCurrentPage = currentPageState[0];
  const setCurrentPage: SetupSetCurrentPage = currentPageState[1];
  const availableMethodsState: SetupAvailableMethodsState = useState<SetupAvailableMethods>([]);
  const availableMethods: SetupAvailableMethods = availableMethodsState[0];
  const setAvailableMethods: SetupSetAvailableMethods = availableMethodsState[1];
  const selectedMethodState: SetupSelectedMethodState = useState<SetupSelectedMethod>('unknown');
  const selectedMethod: SetupSelectedMethod = selectedMethodState[0];
  const setSelectedMethod: SetupSetSelectedMethod = selectedMethodState[1];
  const updateSensorsState: SetupUpdateSensorsState = useState<SetupUpdateSensors>(false);
  const updateSensors: SetupUpdateSensors = updateSensorsState[0];
  const setUpdateSensors: SetupSetUpdateSensors = updateSensorsState[1];

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

export default Setup;

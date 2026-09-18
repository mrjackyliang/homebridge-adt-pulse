import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import type {
  SetupSensorsConfig,
  SetupSensorsConfigs,
  SetupSensorsHasExistingSensors,
  SetupSensorsHasExistingSensorsState,
  SetupSensorsOnSubmit,
  SetupSensorsOnSubmitReturns,
  SetupSensorsOnSubmitUpdateSensors,
  SetupSensorsProps,
  SetupSensorsProps_Homebridge,
  SetupSensorsProps_SetCurrentPage,
  SetupSensorsProps_SetUpdateSensors,
  SetupSensorsSetHasExistingSensors,
} from '../types/config-ui.d.ts';

/**
 * Pages - Setup Sensors - Setup Sensors.
 *
 * Renders the setup step that offers to download supported sensor statuses
 * into the plugin config so first time users start out with sensors filled in.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SetupSensors(props: SetupSensorsProps) {
  const homebridge: SetupSensorsProps_Homebridge = props['homebridge'];
  const setCurrentPage: SetupSensorsProps_SetCurrentPage = props['setCurrentPage'];
  const setUpdateSensors: SetupSensorsProps_SetUpdateSensors = props['setUpdateSensors'];

  const hasExistingSensorsState: SetupSensorsHasExistingSensorsState = useState<SetupSensorsHasExistingSensors>(false);
  const hasExistingSensors: SetupSensorsHasExistingSensors = hasExistingSensorsState[0];
  const setHasExistingSensors: SetupSensorsSetHasExistingSensors = hasExistingSensorsState[1];

  /**
   * Pages - Setup Sensors - Setup Sensors - On Submit.
   *
   * Records whether the user chose to download sensor data for the parent
   * wizard, then advances to the next page even when Homebridge is unavailable.
   *
   * @param {SetupSensorsOnSubmitUpdateSensors} updateSensors - Update sensors.
   *
   * @returns {SetupSensorsOnSubmitReturns}
   *
   * @since 1.0.0
   */
  const onSubmit: SetupSensorsOnSubmit = async (updateSensors: SetupSensorsOnSubmitUpdateSensors): SetupSensorsOnSubmitReturns => {
    if (homebridge === undefined) {
      setCurrentPage((previousPage) => previousPage + 1);

      return;
    }

    setUpdateSensors(updateSensors);

    // Move to the next page.
    setCurrentPage((previousPage) => previousPage + 1);

    return;
  };

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        return;
      }

      const configs: SetupSensorsConfigs = await homebridge.getPluginConfig();
      const config: SetupSensorsConfig = configs[0] ?? {};

      // For user experience purposes.
      if (_.get(config, ['sensors'], []).length > 0) {
        setHasExistingSensors(true);
      }

      return;
    })();

    return;
  }, [
    homebridge,
    setHasExistingSensors,
  ]);

  return (
    <>
      <section>
        <h3>Step 4 - Sensors</h3>
        <p>
          Download and configure supported sensor statuses into Homebridge effortlessly. Highly recommended for first time users. To view what sensors are supported at this time,
          {' '}
          <a href="https://github.com/mrjackyliang/homebridge-adt-pulse?tab=readme-ov-file#supported-devices" target="_blank" rel="noreferrer">view the readme</a>
          {' '}
          on GitHub.
        </p>
      </section>
      <div className="d-flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={() => onSubmit(true)}>
          {(hasExistingSensors === true) ? 'Update' : 'Download'}
          {' '}
          Sensors Data
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => onSubmit(false)}>Skip</button>
      </div>
    </>
  );
}

export default SetupSensors;

import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import type { SetupSensorsOnSubmitReturns, SetupSensorsOnSubmitUpdateSensors, SetupSensorsProps } from '@/types/config-ui.d.ts';

/**
 * Setup sensors.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function SetupSensors(props: SetupSensorsProps) {
  const { homebridge, setCurrentPage, setUpdateSensors } = props;

  const [hasExistingSensors, setHasExistingSensors] = useState(false);

  /**
   * Setup sensors - On submit.
   *
   * @param {SetupSensorsOnSubmitUpdateSensors} updateSensors - Update sensors.
   *
   * @returns {SetupSensorsOnSubmitReturns}
   *
   * @since 1.0.0
   */
  const onSubmit = async (updateSensors: SetupSensorsOnSubmitUpdateSensors): SetupSensorsOnSubmitReturns => {
    if (homebridge === undefined) {
      setCurrentPage((previousPage) => previousPage + 1);

      return;
    }

    setUpdateSensors(updateSensors);

    // Move to the next page.
    setCurrentPage((previousPage) => previousPage + 1);
  };

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        return;
      }

      const configs = await homebridge.getPluginConfig();
      const config = configs[0] ?? {};

      // For user experience purposes.
      if (_.get(config, ['sensors'], []).length > 0) {
        setHasExistingSensors(true);
      }
    })();
  }, [
    homebridge,
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
      <div className="d-flex">
        <button type="button" className="btn btn-primary ml-0" onClick={() => onSubmit(true)}>
          {(hasExistingSensors) ? 'Update' : 'Download'}
          {' '}
          Sensors Data
        </button>
        <button type="button" className="btn btn-elegant" onClick={() => onSubmit(false)}>Skip</button>
      </div>
    </>
  );
}

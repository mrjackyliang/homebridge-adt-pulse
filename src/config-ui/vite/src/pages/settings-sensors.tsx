import React from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';

import { styles } from '@/config-ui/vite/src/styles/pages/settings-sensors.js';
import type { SettingsSensorsGetSensorHeaderIndex, SettingsSensorsGetSensorHeaderReturns, SettingsSensorsProps } from '@/types/config-ui.d.ts';

/**
 * Settings sensors.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function SettingsSensors(props: SettingsSensorsProps) {
  const { control } = props;

  const { fields: sensors, append, remove } = useFieldArray({
    control,
    name: 'sensors',
  });
  const watch = useWatch({
    control,
    name: 'sensors',
  });

  /**
   * Settings sensors - Get sensor header.
   *
   * @param {SettingsSensorsGetSensorHeaderIndex} index - Index.
   *
   * @returns {SettingsSensorsGetSensorHeaderReturns}
   *
   * @since 1.0.0
   */
  const getSensorHeader = (index: SettingsSensorsGetSensorHeaderIndex): SettingsSensorsGetSensorHeaderReturns => {
    const sensor = watch[index];

    if (sensor === undefined) {
      return {
        name: null,
        adtName: null,
      };
    }

    const sensorName = sensor.name;
    const sensorAdtName = sensor.adtName;

    if (sensorName && sensorAdtName) {
      return {
        name: sensorName,
        adtName: sensorAdtName,
      };
    }

    if (sensorName) {
      return {
        name: sensorName,
        adtName: null,
      };
    }

    if (sensorAdtName) {
      return {
        name: null,
        adtName: sensorAdtName,
      };
    }

    return {
      name: 'Sensor',
      adtName: null,
    };
  };

  return (
    <>
      <p className="help-block">This section allows you to define your ADT connected sensors here. Sensors include connected devices like &quot;Door/Window Sensor&quot; or &quot;Motion Sensor&quot;. If you would like to update your sensors, re-run the setup wizard.</p>
      <p className="alert alert-info">
        A maximum of 147 sensors can be added (3 slots are reserved for the gateway, security panel, and alarm ringing switch).
        {' '}
        <strong>Z-Wave connected accessories are not supported.</strong>
      </p>
      <div className="accordion" id="accordion">
        {
          sensors.map((sensor, index) => (
            <div key={sensor.id} className="accordion-item">
              <div className="accordion-header" id={`heading-${sensor.id}`}>
                <button
                  type="button"
                  className="accordion-button collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${sensor.id}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${sensor.id}`}
                >
                  <div className="d-flex justify-content-between" style={styles.sensorHeader}>
                    <div className="container-fluid">
                      <div className="row">
                        {
                          (getSensorHeader(index).name !== null && getSensorHeader(index).adtName !== null) ? (
                            <>
                              <div className="col-6 text-break">
                                {getSensorHeader(index).name}
                              </div>
                              <div className="col-6 text-secondary text-end text-break fst-italic">
                                {getSensorHeader(index).adtName}
                              </div>
                            </>
                          ) : null
                        }
                        {
                          (getSensorHeader(index).name !== null && getSensorHeader(index).adtName === null) ? (
                            <div className="col-6 text-break">
                              {getSensorHeader(index).name}
                            </div>
                          ) : null
                        }
                        {
                          (getSensorHeader(index).name === null && getSensorHeader(index).adtName !== null) ? (
                            <div className="col-6 text-break">
                              {getSensorHeader(index).adtName}
                            </div>
                          ) : null
                        }
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              <div id={`collapse-${sensor.id}`} className="accordion-collapse collapse" data-bs-parent="#accordion">
                <div className="accordion-body">
                  <div className="mb-3">
                    <Controller
                      name={`sensors.${index}.name`}
                      control={control}
                      defaultValue={sensor.name}
                      render={({ field, fieldState }) => (
                        <>
                          <label htmlFor={field.name} className="d-block">
                            <div className="form-label">Name</div>
                            <input
                              type="text"
                              id={field.name}
                              name={field.name}
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              className={(fieldState.error) ? 'form-control border-danger' : 'form-control'}
                              placeholder="e.g. Family Room Couch Window 1"
                              maxLength={50}
                            />
                          </label>
                          <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                            {
                              (fieldState.error) ? fieldState.error.message : (
                                <>
                                  <strong className="font-weight-bold">Optional.</strong>
                                  {' '}
                                  Provide a display name for this sensor to differentiate it from the names assigned by ADT technicians during installation.
                                </>
                              )
                            }
                          </div>
                        </>
                      )}
                    />
                  </div>
                  <div className="row g-3 mx-0">
                    <div className="col pl-0">
                      <div className="mb-3">
                        <Controller
                          name={`sensors.${index}.adtName`}
                          control={control}
                          defaultValue={sensor.adtName}
                          render={({ field, fieldState }) => (
                            <>
                              <label htmlFor={field.name} className="d-block">
                                <div className="form-label">
                                  ADT Sensor Name
                                  {' '}
                                  <strong className="text-danger">*</strong>
                                </div>
                                <input
                                  type="text"
                                  id={field.name}
                                  name={field.name}
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  className={(fieldState.error) ? 'form-control border-danger' : 'form-control'}
                                  placeholder="e.g. Family Room Window (99)"
                                  maxLength={50}
                                  required
                                />
                              </label>
                              <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                                {
                                  (fieldState.error) ? fieldState.error.message : (
                                    <>
                                      Specify the
                                      {' '}
                                      <strong className="font-weight-bold">exact name</strong>
                                      {' '}
                                      associated with the sensor you want to add. Double-check the names to ensure they don&apos;t include extra characters.
                                    </>
                                  )
                                }
                              </div>
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <div className="col pl-0">
                      <div className="mb-3">
                        <Controller
                          name={`sensors.${index}.adtZone`}
                          control={control}
                          defaultValue={sensor.adtZone}
                          render={({ field, fieldState }) => (
                            <>
                              <label htmlFor={field.name} className="d-block">
                                <div className="form-label">
                                  ADT Sensor Zone
                                  {' '}
                                  <strong className="text-danger">*</strong>
                                </div>
                                <input
                                  type="number"
                                  id={field.name}
                                  name={field.name}
                                  value={field.value}
                                  onChange={(event) => field.onChange(Number(event.target.value))}
                                  onBlur={field.onBlur}
                                  className={(fieldState.error) ? 'form-control border-danger' : 'form-control'}
                                  placeholder="e.g. 99"
                                  maxLength={50}
                                  required
                                />
                              </label>
                              <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                                {
                                  (fieldState.error) ? fieldState.error.message : (
                                    <>
                                      Specify the
                                      {' '}
                                      <strong className="font-weight-bold">exact zone</strong>
                                      {' '}
                                      associated with the sensor you want to add. Double-check the zone to ensure the correct sensor is added.
                                    </>
                                  )
                                }
                              </div>
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <Controller
                      name={`sensors.${index}.adtType`}
                      control={control}
                      defaultValue={sensor.adtType}
                      render={({ field, fieldState }) => (
                        <>
                          <label htmlFor={field.name} className="d-block">
                            <div className="form-label">
                              ADT Sensor Type
                              {' '}
                              <strong className="text-danger">*</strong>
                            </div>
                            <select
                              id={field.name}
                              name={field.name}
                              value={field.value}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              className={(fieldState.error) ? 'form-select border-danger' : 'form-select'}
                            >
                              <option value="co">Carbon Monoxide Detector</option>
                              <option value="doorWindow">Door/Window Sensor :: Door Sensor :: Window Sensor</option>
                              <option value="fire">Fire (Smoke/Heat) Detector</option>
                              <option value="flood">Water/Flood Sensor</option>
                              <option value="glass">Glass Break Detector</option>
                              <option value="heat">Heat (Rate-of-Rise) Detector</option>
                              <option value="motion">Motion Sensor :: Motion Sensor (Notable Events Only)</option>
                              <option value="shock">Shock Sensor</option>
                              <option value="temperature">Temperature Sensor</option>
                            </select>
                          </label>
                          <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                            {
                              (fieldState.error) ? fieldState.error.message : (
                                <>
                                  Select the
                                  {' '}
                                  <strong className="font-weight-bold">type</strong>
                                  {' '}
                                  associated with the sensor you want to add. Ensure your selection matches the sensor type, as selecting the wrong type may lead to incorrect status detection.
                                </>
                              )
                            }
                          </div>
                        </>
                      )}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary ml-0"
                    onClick={() => remove(index)}
                  >
                    Remove Sensor
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      {
        (sensors.length <= 147) ? (
          <div className="mt-3">
            <button
              type="button"
              className="btn btn-primary ml-0"
              onClick={() => append({
                name: '',
                adtName: '',
                adtZone: 1,
                adtType: 'co',
              })}
            >
              Add Sensor
            </button>
          </div>
        ) : null
      }
    </>
  );
}

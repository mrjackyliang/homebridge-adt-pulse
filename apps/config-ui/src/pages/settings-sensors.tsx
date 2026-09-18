import React, { useState } from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';

import { styles } from '../styles/pages/settings-sensors.js';

import type {
  SettingsSensorsAppend,
  SettingsSensorsFieldArray,
  SettingsSensorsGetSensorHeader,
  SettingsSensorsGetSensorHeaderIndex,
  SettingsSensorsGetSensorHeaderReturns,
  SettingsSensorsGetSensorHeaderSensor,
  SettingsSensorsGetSensorHeaderSensorAdtName,
  SettingsSensorsGetSensorHeaderSensorName,
  SettingsSensorsOpenSensor,
  SettingsSensorsOpenSensorState,
  SettingsSensorsProps,
  SettingsSensorsProps_Control,
  SettingsSensorsRemove,
  SettingsSensorsSensors,
  SettingsSensorsSetOpenSensor,
  SettingsSensorsWatch,
} from '../types/config-ui.d.ts';

/**
 * Pages - Settings Sensors - Settings Sensors.
 *
 * Renders the sensors section of the plugin settings page so users can review
 * the ADT-connected sensors saved in their configuration and adjust each
 * sensor's display name, ADT name, zone, and type.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SettingsSensors(props: SettingsSensorsProps) {
  const control: SettingsSensorsProps_Control = props['control'];

  const fieldArray: SettingsSensorsFieldArray = useFieldArray({
    control,
    name: 'sensors',
  });
  const sensors: SettingsSensorsSensors = fieldArray.fields;
  const append: SettingsSensorsAppend = fieldArray.append;
  const remove: SettingsSensorsRemove = fieldArray.remove;
  const watch: SettingsSensorsWatch = useWatch({
    control,
    name: 'sensors',
  }) ?? [];
  const openSensorState: SettingsSensorsOpenSensorState = useState<SettingsSensorsOpenSensor>(null);
  const openSensor: SettingsSensorsOpenSensor = openSensorState[0];
  const setOpenSensor: SettingsSensorsSetOpenSensor = openSensorState[1];

  /**
   * Pages - Settings Sensors - Settings Sensors - Get Sensor Header.
   *
   * Builds the accordion header labels for a sensor row so the list can show
   * the custom display name, the ADT-assigned name, or a fallback label when
   * the sensor has not been named yet.
   *
   * @param {SettingsSensorsGetSensorHeaderIndex} index - Index.
   *
   * @returns {SettingsSensorsGetSensorHeaderReturns}
   *
   * @since 1.0.0
   */
  const getSensorHeader: SettingsSensorsGetSensorHeader = (index: SettingsSensorsGetSensorHeaderIndex): SettingsSensorsGetSensorHeaderReturns => {
    const sensor: SettingsSensorsGetSensorHeaderSensor = watch[index];

    if (sensor === undefined) {
      return {
        name: null,
        adtName: null,
      };
    }

    const sensorName: SettingsSensorsGetSensorHeaderSensorName = sensor['name'];
    const sensorAdtName: SettingsSensorsGetSensorHeaderSensorAdtName = sensor['adtName'];

    if (
      sensorName !== undefined
      && sensorName !== ''
      && sensorAdtName !== ''
    ) {
      return {
        name: sensorName,
        adtName: sensorAdtName,
      };
    }

    if (sensorName !== undefined && sensorName !== '') {
      return {
        name: sensorName,
        adtName: null,
      };
    }

    if (sensorAdtName !== '') {
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
                  className={(openSensor === sensor.id) ? 'accordion-button' : 'accordion-button collapsed'}
                  onClick={() => setOpenSensor((openSensor === sensor.id) ? null : sensor.id)}
                  aria-expanded={openSensor === sensor.id}
                  aria-controls={`collapse-${sensor.id}`}
                >
                  <div className="sensor-header d-flex justify-content-between" style={styles['sensorHeader']}>
                    <div className="container-fluid">
                      <div className="row">
                        {
                          (getSensorHeader(index)['name'] !== null && getSensorHeader(index)['adtName'] !== null) ? (
                            <>
                              <div className="col-6 text-break">
                                {getSensorHeader(index)['name']}
                              </div>
                              <div className="col-6 text-end text-break fst-italic">
                                {getSensorHeader(index)['adtName']}
                              </div>
                            </>
                          ) : null
                        }
                        {
                          (getSensorHeader(index)['name'] !== null && getSensorHeader(index)['adtName'] === null) ? (
                            <div className="col-6 text-break">
                              {getSensorHeader(index)['name']}
                            </div>
                          ) : null
                        }
                        {
                          (getSensorHeader(index)['name'] === null && getSensorHeader(index)['adtName'] !== null) ? (
                            <div className="col-6 text-break">
                              {getSensorHeader(index)['adtName']}
                            </div>
                          ) : null
                        }
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              <div id={`collapse-${sensor.id}`} className={(openSensor === sensor.id) ? 'accordion-collapse collapse show' : 'accordion-collapse collapse'} hidden={openSensor !== sensor.id}>
                <div className="accordion-body">
                  <div className="mb-3">
                    <Controller
                      name={`sensors.${index}.name`}
                      control={control}
                      defaultValue={sensor['name']}
                      render={(renderProps) => (
                        <>
                          <label htmlFor={renderProps.field.name} className="d-block">
                            <div className="form-label">Name</div>
                            <input
                              type="text"
                              id={renderProps.field.name}
                              name={renderProps.field.name}
                              value={renderProps.field.value}
                              onChange={renderProps.field.onChange}
                              onBlur={renderProps.field.onBlur}
                              className={(renderProps.fieldState.error !== undefined) ? 'form-control border-danger' : 'form-control'}
                              placeholder="e.g. Family Room Couch Window 1"
                              maxLength={50}
                            />
                          </label>
                          <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                            {
                              (renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : (
                                <>
                                  <strong>Optional.</strong>
                                  {' '}
                                  Provide a display name for this sensor to differentiate it from the names assigned by ADT technicians during installation. Start and end with a letter or number; leave blank to use the ADT name.
                                </>
                              )
                            }
                          </div>
                        </>
                      )}
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <Controller
                          name={`sensors.${index}.adtName`}
                          control={control}
                          defaultValue={sensor['adtName']}
                          render={(renderProps) => (
                            <>
                              <label htmlFor={renderProps.field.name} className="d-block">
                                <div className="form-label">
                                  ADT Sensor Name
                                  {' '}
                                  <strong className="text-danger">*</strong>
                                </div>
                                <input
                                  type="text"
                                  id={renderProps.field.name}
                                  name={renderProps.field.name}
                                  value={renderProps.field.value}
                                  onChange={renderProps.field.onChange}
                                  onBlur={renderProps.field.onBlur}
                                  className={(renderProps.fieldState.error !== undefined) ? 'form-control border-danger' : 'form-control'}
                                  placeholder="e.g. Family Room Window (99)"
                                  maxLength={50}
                                  required
                                />
                              </label>
                              <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                                {
                                  (renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : (
                                    <>
                                      Specify the
                                      {' '}
                                      <strong>exact name</strong>
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
                    <div className="col-12 col-md-6">
                      <div className="mb-3">
                        <Controller
                          name={`sensors.${index}.adtZone`}
                          control={control}
                          defaultValue={sensor['adtZone']}
                          render={(renderProps) => (
                            <>
                              <label htmlFor={renderProps.field.name} className="d-block">
                                <div className="form-label">
                                  ADT Sensor Zone
                                  {' '}
                                  <strong className="text-danger">*</strong>
                                </div>
                                <input
                                  type="number"
                                  id={renderProps.field.name}
                                  name={renderProps.field.name}
                                  value={renderProps.field.value}
                                  onChange={(event) => renderProps.field.onChange(Number(event.target.value))}
                                  onBlur={renderProps.field.onBlur}
                                  className={(renderProps.fieldState.error !== undefined) ? 'form-control border-danger' : 'form-control'}
                                  placeholder="e.g. 99"
                                  min={1}
                                  max={99}
                                  required
                                />
                              </label>
                              <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                                {
                                  (renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : (
                                    <>
                                      Specify the
                                      {' '}
                                      <strong>exact zone</strong>
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
                      defaultValue={sensor['adtType']}
                      render={(renderProps) => (
                        <>
                          <label htmlFor={renderProps.field.name} className="d-block">
                            <div className="form-label">
                              ADT Sensor Type
                              {' '}
                              <strong className="text-danger">*</strong>
                            </div>
                            <select
                              id={renderProps.field.name}
                              name={renderProps.field.name}
                              value={renderProps.field.value}
                              onChange={renderProps.field.onChange}
                              onBlur={renderProps.field.onBlur}
                              className={(renderProps.fieldState.error !== undefined) ? 'form-select border-danger' : 'form-select'}
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
                          <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                            {
                              (renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : (
                                <>
                                  Select the
                                  {' '}
                                  <strong>type</strong>
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
                    className="btn btn-primary"
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
              className="btn btn-primary"
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

export default SettingsSensors;

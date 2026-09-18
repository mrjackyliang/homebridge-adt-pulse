import React from 'react';
import { Controller } from 'react-hook-form';

import type {
  SettingsGeneralHandleOptionsChange,
  SettingsGeneralHandleOptionsChangeChecked,
  SettingsGeneralHandleOptionsChangePreviousValues,
  SettingsGeneralHandleOptionsChangeReturns,
  SettingsGeneralHandleOptionsChangeUpdatedValues,
  SettingsGeneralHandleOptionsChangeValue,
  SettingsGeneralOptionsCheckboxes,
  SettingsGeneralProps,
  SettingsGeneralProps_Control,
  SettingsGeneralProps_GetValues,
  SettingsGeneralProps_SetValue,
} from '../types/config-ui.d.ts';

/**
 * Pages - Settings General - Settings General.
 *
 * Renders the general settings form of the plugin configuration UI, exposing the
 * plugin name, operational mode, synchronization speed, and advanced option
 * checkboxes as react-hook-form controlled fields.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SettingsGeneral(props: SettingsGeneralProps) {
  const control: SettingsGeneralProps_Control = props['control'];
  const getValues: SettingsGeneralProps_GetValues = props['getValues'];
  const setValue: SettingsGeneralProps_SetValue = props['setValue'];

  // Checkboxes for "Advanced Options".
  const optionsCheckboxes: SettingsGeneralOptionsCheckboxes = [
    {
      id: 'disable-alarm-ringing-switch',
      label: 'Disable "Alarm Ringing" switch',
      value: 'disableAlarmRingingSwitch',
    },
    {
      id: 'ignore-sensor-problem-status',
      label: 'Ignore "Sensor Problem" Panel Status',
      value: 'ignoreSensorProblemStatus',
    },
  ];

  /**
   * Pages - Settings General - Settings General - Handle Options Change.
   *
   * Keeps the "options" form value in sync with the advanced option checkboxes by
   * appending the option when it becomes checked and removing it when unchecked.
   *
   * @param {SettingsGeneralHandleOptionsChangeChecked} checked - Checked.
   * @param {SettingsGeneralHandleOptionsChangeValue}   value   - Value.
   *
   * @returns {SettingsGeneralHandleOptionsChangeReturns}
   *
   * @since 1.0.0
   */
  const handleOptionsChange: SettingsGeneralHandleOptionsChange = (checked: SettingsGeneralHandleOptionsChangeChecked, value: SettingsGeneralHandleOptionsChangeValue): SettingsGeneralHandleOptionsChangeReturns => {
    const previousValues: SettingsGeneralHandleOptionsChangePreviousValues = getValues('options') ?? [];

    if (checked === true) {
      if (previousValues.includes(value) === false) {
        setValue('options', [
          ...previousValues,
          value,
        ]);
      }
    } else {
      const updatedValues: SettingsGeneralHandleOptionsChangeUpdatedValues = previousValues.filter((previousValue) => previousValue !== value);

      setValue('options', updatedValues);
    }

    return;
  };

  return (
    <>
      <div className="mb-3">
        <Controller
          name="name"
          control={control}
          defaultValue={getValues('name')}
          render={(renderProps) => ((
            <>
              <label htmlFor={renderProps.field.name} className="d-block">
                <div className="form-label">
                  Name
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
                  placeholder="e.g. ADT Pulse"
                  maxLength={50}
                  required
                />
              </label>
              <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                {(renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : 'Enter a unique name for this plugin. The name will mainly be used for identification purposes, such as in Homebridge logs.'}
              </div>
            </>
          ))}
        />
      </div>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="mb-3">
            <Controller
              name="mode"
              control={control}
              defaultValue={getValues('mode')}
              render={(renderProps) => ((
                <>
                  <label htmlFor={renderProps.field.name} className="d-block">
                    <div className="form-label">
                      Operational Mode
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
                      <option value="normal">Normal</option>
                      <option value="paused">Paused</option>
                      <option value="reset">Reset</option>
                    </select>
                  </label>
                  <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                    {(renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : 'Choose the operational mode for this plugin. Debug mode is enabled only when Homebridge debug mode is on; there is no separate setting for this.'}
                  </div>
                </>
              ))}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="mb-3">
            <Controller
              name="speed"
              control={control}
              defaultValue={getValues('speed')}
              render={(renderProps) => ((
                <>
                  <label htmlFor={renderProps.field.name} className="d-block">
                    <div className="form-label">
                      Synchronization Speed
                      {' '}
                      <strong className="text-danger">*</strong>
                    </div>
                    <select
                      id={renderProps.field.name}
                      name={renderProps.field.name}
                      value={renderProps.field.value}
                      onChange={(event) => renderProps.field.onChange(Number(event.target.value))}
                      onBlur={renderProps.field.onBlur}
                      className={(renderProps.fieldState.error !== undefined) ? 'form-select border-danger' : 'form-select'}
                    >
                      <option value={1}>Normal Speed (1x)</option>
                      <option value={0.75}>Moderate Speed (0.75x)</option>
                      <option value={0.5}>Slower Speed (0.5x)</option>
                      <option value={0.25}>Slowest Speed (0.25x)</option>
                    </select>
                  </label>
                  <div className={(renderProps.fieldState.error !== undefined) ? 'form-text text-danger' : 'form-text'}>
                    {(renderProps.fieldState.error !== undefined) ? renderProps.fieldState.error.message : 'Choose the synchronization speed for this plugin. Designed to enhance the performance of devices with older hardware. Results in slower device updates.'}
                  </div>
                </>
              ))}
            />
          </div>
        </div>
      </div>
      <div className="mb-3">
        <div className="form-label">Advanced Options</div>
        {
          optionsCheckboxes.map((optionsCheckbox) => (
            <div key={optionsCheckbox['id']} className="form-check">
              <Controller
                name="options"
                control={control}
                render={(renderProps) => (
                  <>
                    <input
                      type="checkbox"
                      id={optionsCheckbox['id']}
                      name={`${renderProps.field.name}[]`}
                      value={optionsCheckbox['value']}
                      onChange={(event) => handleOptionsChange(event.target.checked, optionsCheckbox['value'])}
                      checked={(getValues('options') ?? []).includes(optionsCheckbox['value'])}
                      className="form-check-input"
                    />
                    <label htmlFor={optionsCheckbox['id']} className="form-check-label">{optionsCheckbox['label']}</label>
                  </>
                )}
              />
            </div>
          ))
        }
        <div className="form-text">
          Customize the features of this plugin. Please note these advanced options will disable expected functionality. Only enable them if necessary.
        </div>
      </div>
    </>
  );
}

export default SettingsGeneral;

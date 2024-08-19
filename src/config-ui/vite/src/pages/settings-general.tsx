import React from 'react';
import { Controller } from 'react-hook-form';

import type {
  SettingsGeneralHandleOptionsChangeChecked,
  SettingsGeneralHandleOptionsChangeReturns,
  SettingsGeneralHandleOptionsChangeValue,
  SettingsGeneralOptionsCheckboxes,
  SettingsGeneralProps,
} from '@/types/config-ui.d.ts';

/**
 * Settings general.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function SettingsGeneral(props: SettingsGeneralProps) {
  const { control, getValues, setValue } = props;

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
   * Settings general - Handle options change.
   *
   * @param {SettingsGeneralHandleOptionsChangeChecked} checked - Checked.
   * @param {SettingsGeneralHandleOptionsChangeValue}   value   - Value.
   *
   * @returns {SettingsGeneralHandleOptionsChangeReturns}
   *
   * @since 1.0.0
   */
  const handleOptionsChange = (checked: SettingsGeneralHandleOptionsChangeChecked, value: SettingsGeneralHandleOptionsChangeValue): SettingsGeneralHandleOptionsChangeReturns => {
    const previousValues = getValues('options');

    if (checked) {
      if (!previousValues.includes(value)) {
        setValue('options', [...previousValues, value]);
      }
    } else {
      const updatedValues = previousValues.filter((previousValue) => previousValue !== value);

      setValue('options', updatedValues);
    }
  };

  return (
    <>
      <div className="mb-3">
        <Controller
          name="name"
          control={control}
          defaultValue={getValues('name')}
          render={({ field, fieldState }) => ((
            <>
              <label htmlFor={field.name} className="d-block">
                <div className="form-label">
                  Name
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
                  placeholder="e.g. ADT Pulse"
                  maxLength={50}
                  required
                />
              </label>
              <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                {(fieldState.error) ? fieldState.error.message : 'Enter a unique name for this plugin. The name will mainly be used for identification purposes, such as in Homebridge logs.'}
              </div>
            </>
          ))}
        />
      </div>
      <div className="row g-3 mx-0">
        <div className="col pl-0">
          <div className="mb-3">
            <Controller
              name="mode"
              control={control}
              defaultValue={getValues('mode')}
              render={({ field, fieldState }) => ((
                <>
                  <label htmlFor={field.name} className="d-block">
                    <div className="form-label">
                      Operational Mode
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
                      <option value="normal">Normal</option>
                      <option value="paused">Paused</option>
                      <option value="reset">Reset</option>
                    </select>
                  </label>
                  <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                    {(fieldState.error) ? fieldState.error.message : 'Choose the operational mode for this plugin. Debug mode is enabled only when Homebridge debug mode is on; there is no separate setting for this.'}
                  </div>
                </>
              ))}
            />
          </div>
        </div>
        <div className="col pr-0">
          <div className="mb-3">
            <Controller
              name="speed"
              control={control}
              defaultValue={getValues('speed')}
              render={({ field, fieldState }) => ((
                <>
                  <label htmlFor={field.name} className="d-block">
                    <div className="form-label">
                      Synchronization Speed
                      {' '}
                      <strong className="text-danger">*</strong>
                    </div>
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.value}
                      onChange={(event) => field.onChange(Number(event.target.value))}
                      onBlur={field.onBlur}
                      className={(fieldState.error) ? 'form-select border-danger' : 'form-select'}
                    >
                      <option value={1}>Normal Speed (1x)</option>
                      <option value={0.75}>Moderate Speed (0.75x)</option>
                      <option value={0.5}>Slower Speed (0.5x)</option>
                      <option value={0.25}>Slowest Speed (0.25x)</option>
                    </select>
                  </label>
                  <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                    {(fieldState.error) ? fieldState.error.message : 'Choose the synchronization speed for this plugin. Designed to enhance the performance of devices with older hardware. Results in slower device updates.'}
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
            <div key={optionsCheckbox.id} className="form-check">
              <Controller
                name="options"
                control={control}
                render={({ field }) => (
                  <label htmlFor={field.name}>
                    <input
                      type="checkbox"
                      id={`${field.name}[]`}
                      name={`${field.name}[]`}
                      value={optionsCheckbox.value}
                      onChange={(event) => handleOptionsChange(event.target.checked, optionsCheckbox.value)}
                      checked={getValues('options').includes(optionsCheckbox.value)}
                      className="form-check-input"
                    />
                    <span className="form-check-label">{optionsCheckbox.label}</span>
                  </label>
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

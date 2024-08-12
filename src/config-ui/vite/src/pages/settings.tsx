import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { platformConfig } from '@/lib/schema.js';
import type { SettingsProps } from '@/types/config-ui.d.ts';

/**
 * Settings.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function Settings(props: SettingsProps) {
  const { homebridge, setView } = props;

  const {
    control,
    formState,
    // handleSubmit,
    reset,
    watch,
  } = useForm<z.infer<typeof platformConfig>>({
    mode: 'onTouched',
    defaultValues: {
      name: 'ADT Pulse',
      subdomain: 'portal',
      username: '',
      password: '',
      fingerprint: '',
      mode: 'normal',
      speed: 1,
      options: [],
      sensors: [],
    },
    resolver: zodResolver(platformConfig),
  });

  const optionsState = watch('options'); // TODO

  useEffect(() => {
    console.log('formState', formState); // TODO
    console.log('optionsState', optionsState); // TODO
  }, [optionsState]);

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        return;
      }

      const configs = await homebridge.getPluginConfig();
      const config = configs[0];

      // Set the most up-to-date config.
      reset(config);

      console.log('config', config); // TODO
    })();
  }, []);

  return (
    <>
      <ul className="nav nav-tabs nav-fill mb-3" id="settings-tab" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" id="settings-general-tab" data-bs-toggle="pill" href="#settings-general" role="tab" aria-controls="settings-general" aria-selected="true">General</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="settings-login-tab" data-bs-toggle="pill" href="#settings-login" role="tab" aria-controls="settings-login" aria-selected="false">Login</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="settings-fingerprint-tab" data-bs-toggle="pill" href="#settings-fingerprint" role="tab" aria-controls="settings-fingerprint" aria-selected="false">Fingerprint</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="settings-sensors-tab" data-bs-toggle="pill" href="#settings-sensors" role="tab" aria-controls="settings-sensors" aria-selected="false">Sensors</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" id="settings-system-tab" data-bs-toggle="pill" href="#settings-system" role="tab" aria-controls="settings-system" aria-selected="false">System</a>
        </li>
      </ul>
      <div className="tab-content" id="settings-tab-content">
        <div className="tab-pane show active" id="settings-general" role="tabpanel" aria-labelledby="settings-general-tab">
          <div className="mb-3">
            <Controller
              name="name"
              control={control}
              defaultValue=""
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
                      placeholder=""
                      maxLength={100}
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
          <div className="row g-3">
            <div className="col">
              <div className="mb-3">
                <Controller
                  name="mode"
                  control={control}
                  defaultValue="normal"
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
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          className={(fieldState.error) ? 'form-select border-danger' : 'form-select'}
                        >
                          <option value="normal" selected={field.value === 'normal'}>Normal</option>
                          <option value="paused" selected={field.value === 'paused'}>Paused</option>
                          <option value="reset" selected={field.value === 'reset'}>Reset</option>
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
            <div className="col">
              <div className="mb-3">
                <Controller
                  name="speed"
                  control={control}
                  defaultValue={1}
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
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          className={(fieldState.error) ? 'form-select border-danger' : 'form-select'}
                        >
                          <option value={1} selected={field.value === 1}>Normal Speed (1x)</option>
                          <option value={0.75} selected={field.value === 0.75}>Moderate Speed (0.75x)</option>
                          <option value={0.5} selected={field.value === 0.5}>Slower Speed (0.5x)</option>
                          <option value={0.25} selected={field.value === 0.25}>Slowest Speed (0.25x)</option>
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
            <Controller
              name="options"
              control={control}
              defaultValue={[]}
              render={({ field, fieldState }) => ((
                <>
                  <div className="form-label">Advanced Options</div>
                  <div className="form-check">
                    <label htmlFor={field.name}>
                      <input
                        type="checkbox"
                        id={`${field.name}[disableAlarmRingingSwitch]`}
                        name={`${field.name}[disableAlarmRingingSwitch]`}
                        value="disableAlarmRingingSwitch"
                        onChange={field.onChange}
                        className="form-check-input"
                      />
                      <span className="form-check-label">Disable &quot;Alarm Ringing&quot; switch</span>
                    </label>
                  </div>
                  <div className="form-check">
                    <label htmlFor={field.name}>
                      <input
                        type="checkbox"
                        id={`${field.name}[ignoreSensorProblemStatus]`}
                        name={`${field.name}[ignoreSensorProblemStatus]`}
                        value="ignoreSensorProblemStatus"
                        onChange={field.onChange}
                        className="form-check-input"
                      />
                      <span className="form-check-label">Ignore &quot;Sensor Problem&quot; Panel Status</span>
                    </label>
                  </div>
                  <div className={(fieldState.error) ? 'form-text text-danger' : 'form-text'}>
                    {(fieldState.error) ? fieldState.error.message : 'Customize the features of this plugin. Please note these advanced options will disable expected functionality. Only enable them if necessary.'}
                  </div>
                </>
              ))}
            />
          </div>
        </div>
        <div className="tab-pane" id="settings-login" role="tabpanel" aria-labelledby="settings-login-tab">
          login
        </div>
        <div className="tab-pane" id="settings-fingerprint" role="tabpanel" aria-labelledby="settings-fingerprint-tab">
          fingerprint
        </div>
        <div className="tab-pane" id="settings-sensors" role="tabpanel" aria-labelledby="settings-sensors-tab">
          sensors
        </div>
        <div className="tab-pane" id="settings-system" role="tabpanel" aria-labelledby="settings-system-tab">
          system
          <button type="button" onClick={() => setView('setup')}>setup</button>
        </div>
      </div>
    </>
  );
}

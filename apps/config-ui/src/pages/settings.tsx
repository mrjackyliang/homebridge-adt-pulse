import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { platformConfig } from '../../../../packages/homebridge-adt-pulse/src/lib/schema';
import SettingsFingerprint from './settings-fingerprint';
import SettingsGeneral from './settings-general';
import SettingsLogin from './settings-login';
import SettingsPlugin from './settings-plugin';
import SettingsSensors from './settings-sensors';

import type {
  SettingsConfig,
  SettingsConfigs,
  SettingsControl,
  SettingsForm,
  SettingsFormChanges,
  SettingsGetValues,
  SettingsParsedChanges,
  SettingsProps,
  SettingsProps_Homebridge,
  SettingsProps_SetView,
  SettingsReady,
  SettingsReadyState,
  SettingsReset,
  SettingsSetReady,
  SettingsSetTab,
  SettingsSetValue,
  SettingsTab,
  SettingsTabState,
  SettingsWatch,
} from '../types/config-ui.d.ts';

/**
 * Pages - Settings.
 *
 * Renders the tabbed settings editor for the plugin config UI and keeps the
 * Homebridge plugin config synchronized with the form as users make changes.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function Settings(props: SettingsProps) {
  const homebridge: SettingsProps_Homebridge = props['homebridge'];
  const setView: SettingsProps_SetView = props['setView'];

  const form: SettingsForm = useForm<z.input<typeof platformConfig>, unknown, z.output<typeof platformConfig>>({
    mode: 'onTouched',
    defaultValues: {
      platform: 'ADTPulse',
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
  const control: SettingsControl = form.control;
  const getValues: SettingsGetValues = form.getValues;
  const reset: SettingsReset = form.reset;
  const setValue: SettingsSetValue = form.setValue;
  const watch: SettingsWatch = form.watch;
  const readyState: SettingsReadyState = useState<SettingsReady>(false);
  const ready: SettingsReady = readyState[0];
  const setReady: SettingsSetReady = readyState[1];
  const tabState: SettingsTabState = useState<SettingsTab>('general');
  const tab: SettingsTab = tabState[0];
  const setTab: SettingsSetTab = tabState[1];

  const formChanges: SettingsFormChanges = watch();

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        setReady(true);

        return;
      }

      homebridge.showSpinner();

      const configs: SettingsConfigs = await homebridge.getPluginConfig();
      const config: SettingsConfig = configs[0] ?? {};

      // Set the most up-to-date config.
      reset(_.merge({
        platform: 'ADTPulse' as const,
        name: 'ADT Pulse',
        subdomain: 'portal' as const,
        username: '',
        password: '',
        fingerprint: '',
        mode: 'normal' as const,
        speed: 1 as const,
        options: [],
        sensors: [],
      }, config));

      // In case the previous view was classic settings.
      homebridge.hideSchemaForm();

      // Making sure the UI does not randomly flash.
      await new Promise((resolve) => {
        setTimeout(resolve, 500);

        return;
      });

      // Once the schema form hides, set the view to "ready".
      setReady(true);

      homebridge.hideSpinner();

      return;
    })();

    return;
  }, [
    homebridge,
    reset,
    setReady,
  ]);

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        return;
      }

      const parsedChanges: SettingsParsedChanges = platformConfig.safeParse(formChanges);

      if (parsedChanges.success === true) {
        await homebridge.updatePluginConfig([parsedChanges.data]);
      }

      return;
    })();

    return;
  }, [
    formChanges,
    homebridge,
  ]);

  if (ready === true) {
    return (
      <>
        <ul className="nav nav-tabs nav-fill mb-3" id="settings-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button type="button" className={(tab === 'general') ? 'nav-link active' : 'nav-link'} id="settings-general-tab" role="tab" aria-controls="settings-general" aria-selected={tab === 'general'} onClick={() => setTab('general')}>General</button>
          </li>
          <li className="nav-item" role="presentation">
            <button type="button" className={(tab === 'login') ? 'nav-link active' : 'nav-link'} id="settings-login-tab" role="tab" aria-controls="settings-login" aria-selected={tab === 'login'} onClick={() => setTab('login')}>Login</button>
          </li>
          <li className="nav-item" role="presentation">
            <button type="button" className={(tab === 'fingerprint') ? 'nav-link active' : 'nav-link'} id="settings-fingerprint-tab" role="tab" aria-controls="settings-fingerprint" aria-selected={tab === 'fingerprint'} onClick={() => setTab('fingerprint')}>Fingerprint</button>
          </li>
          <li className="nav-item" role="presentation">
            <button type="button" className={(tab === 'sensors') ? 'nav-link active' : 'nav-link'} id="settings-sensors-tab" role="tab" aria-controls="settings-sensors" aria-selected={tab === 'sensors'} onClick={() => setTab('sensors')}>Sensors</button>
          </li>
          <li className="nav-item" role="presentation">
            <button type="button" className={(tab === 'plugin') ? 'nav-link active' : 'nav-link'} id="settings-plugin-tab" role="tab" aria-controls="settings-plugin" aria-selected={tab === 'plugin'} onClick={() => setTab('plugin')}>Plugin</button>
          </li>
        </ul>
        <div className="tab-content" id="settings-tab-content">
          <div className={(tab === 'general') ? 'tab-pane show active' : 'tab-pane'} id="settings-general" role="tabpanel" aria-labelledby="settings-general-tab" hidden={tab !== 'general'}>
            <SettingsGeneral control={control} getValues={getValues} setValue={setValue} />
          </div>
          <div className={(tab === 'login') ? 'tab-pane show active' : 'tab-pane'} id="settings-login" role="tabpanel" aria-labelledby="settings-login-tab" hidden={tab !== 'login'}>
            <SettingsLogin control={control} getValues={getValues} />
          </div>
          <div className={(tab === 'fingerprint') ? 'tab-pane show active' : 'tab-pane'} id="settings-fingerprint" role="tabpanel" aria-labelledby="settings-fingerprint-tab" hidden={tab !== 'fingerprint'}>
            <SettingsFingerprint fingerprint={getValues('fingerprint')} />
          </div>
          <div className={(tab === 'sensors') ? 'tab-pane show active' : 'tab-pane'} id="settings-sensors" role="tabpanel" aria-labelledby="settings-sensors-tab" hidden={tab !== 'sensors'}>
            <SettingsSensors control={control} />
          </div>
          <div className={(tab === 'plugin') ? 'tab-pane show active' : 'tab-pane'} id="settings-plugin" role="tabpanel" aria-labelledby="settings-plugin-tab" hidden={tab !== 'plugin'}>
            <SettingsPlugin homebridge={homebridge} setView={setView} />
          </div>
        </div>
      </>
    );
  }

  return null;
}

export default Settings;

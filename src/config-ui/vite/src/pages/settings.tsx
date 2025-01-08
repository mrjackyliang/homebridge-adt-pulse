import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import SettingsFingerprint from '@/config-ui/vite/src/pages/settings-fingerprint';
import SettingsGeneral from '@/config-ui/vite/src/pages/settings-general';
import SettingsLogin from '@/config-ui/vite/src/pages/settings-login';
import SettingsPlugin from '@/config-ui/vite/src/pages/settings-plugin';
import SettingsSensors from '@/config-ui/vite/src/pages/settings-sensors';
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
    getValues,
    reset,
    setValue,
    watch,
  } = useForm<z.infer<typeof platformConfig>>({
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
  const [ready, setReady] = useState(false);

  const formChanges = watch();

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        setReady(true);

        return;
      }

      homebridge.showSpinner();

      const configs = await homebridge.getPluginConfig();
      const config = configs[0] ?? {};

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
      });

      // Once the schema form hides, set the view to "ready".
      setReady(true);

      homebridge.hideSpinner();
    })();
  }, [
    homebridge,
    reset,
  ]);

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        return;
      }

      await homebridge.updatePluginConfig([formChanges]);
    })();
  }, [
    formChanges,
    homebridge,
  ]);

  if (ready) {
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
            <a className="nav-link" id="settings-plugin-tab" data-bs-toggle="pill" href="#settings-plugin" role="tab" aria-controls="settings-plugin" aria-selected="false">Plugin</a>
          </li>
        </ul>
        <div className="tab-content" id="settings-tab-content">
          <div className="tab-pane show active" id="settings-general" role="tabpanel" aria-labelledby="settings-general-tab">
            <SettingsGeneral control={control} getValues={getValues} setValue={setValue} />
          </div>
          <div className="tab-pane" id="settings-login" role="tabpanel" aria-labelledby="settings-login-tab">
            <SettingsLogin control={control} getValues={getValues} />
          </div>
          <div className="tab-pane" id="settings-fingerprint" role="tabpanel" aria-labelledby="settings-fingerprint-tab">
            <SettingsFingerprint fingerprint={getValues('fingerprint')} />
          </div>
          <div className="tab-pane" id="settings-sensors" role="tabpanel" aria-labelledby="settings-sensors-tab">
            <SettingsSensors control={control} />
          </div>
          <div className="tab-pane" id="settings-plugin" role="tabpanel" aria-labelledby="settings-plugin-tab">
            <SettingsPlugin homebridge={homebridge} setView={setView} />
          </div>
        </div>
      </>
    );
  }

  return null;
}

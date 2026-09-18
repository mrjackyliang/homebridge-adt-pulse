import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import type {
  SettingsPluginInformation,
  SettingsPluginInformationState,
  SettingsPluginProps,
  SettingsPluginProps_Homebridge,
  SettingsPluginProps_SetView,
  SettingsPluginRunning,
  SettingsPluginRunningNames,
  SettingsPluginSetInformation,
} from '../types/config-ui.d.ts';

/**
 * Pages - Settings Plugin - Settings Plugin.
 *
 * Shows a read-only overview of the plugin and its host environment so users
 * can quickly confirm the installed version and the system it runs on when
 * reviewing settings or preparing a bug report.
 *
 * @constructor
 *
 * @since 1.0.0
 */
function SettingsPlugin(props: SettingsPluginProps) {
  const homebridge: SettingsPluginProps_Homebridge = props['homebridge'];
  const setView: SettingsPluginProps_SetView = props['setView'];

  const informationState: SettingsPluginInformationState = useState<SettingsPluginInformation>({
    name: 'homebridge-adt-pulse',
    version: '1.0.0',
    verified: false,
    instanceName: 'Unknown',
    instanceId: 'Unknown',
    homebridgeVersion: 'Unknown',
    nodeVersion: 'Unknown',
    platform: 'Unknown',
    runningOn: 'Unknown',
  });
  const information: SettingsPluginInformation = informationState[0];
  const setInformation: SettingsPluginSetInformation = informationState[1];

  useEffect(() => {
    (async () => {
      if (homebridge === undefined) {
        return;
      }

      const runningNames: SettingsPluginRunningNames = {
        runningInDocker: 'Docker',
        runningInFreeBSD: 'FreeBSD',
        runningInLinux: 'Linux',
        runningInPackageMode: 'Package Mode',
        runningInSynologyPackage: 'Synology Package',
        runningOnRaspberryPi: 'Raspberry Pi',
      };
      const running: SettingsPluginRunning = Object.entries(homebridge.serverEnv.env)
        .filter((envEntry) => envEntry[0].startsWith('running') && envEntry[1] === true)
        .map((envEntry) => _.get(runningNames, [envEntry[0]], ''));

      setInformation({
        name: _.get(homebridge, [
          'plugin',
          'name',
        ], ''),
        version: _.get(homebridge, [
          'plugin',
          'installedVersion',
        ], ''),
        verified: _.get(homebridge, [
          'plugin',
          'verifiedPlugin',
        ], false),
        instanceName: _.get(homebridge, [
          'serverEnv',
          'env',
          'homebridgeInstanceName',
        ], ''),
        instanceId: _.get(homebridge, [
          'serverEnv',
          'env',
          'instanceId',
        ], ''),
        homebridgeVersion: _.get(homebridge, [
          'serverEnv',
          'env',
          'homebridgeVersion',
        ], ''),
        nodeVersion: _.get(homebridge, [
          'serverEnv',
          'env',
          'nodeVersion',
        ], ''),
        platform: _.get(homebridge, [
          'serverEnv',
          'env',
          'platform',
        ], ''),
        runningOn: (running.length > 0) ? running.join(', ') : 'Unknown',
      });

      return;
    })();

    return;
  }, [
    homebridge,
    setInformation,
  ]);

  return (
    <>
      <section className="mb-3">
        <p className="text-body-secondary mb-0">
          <em>
            You are currently
            {' '}
            {
              _.sample([
                'running',
                'enjoying',
                'utilizing',
                'rocking',
                'dominating',
              ])
            }
          </em>
        </p>
        <div className="d-flex flex-row align-items-center gap-2">
          <h3 className="mb-0">
            {information['name']}
            {' '}
            <span className="text-body-secondary">
              v
              {information['version']}
            </span>
          </h3>
          {information['verified'] && <span className="badge rounded-pill verified-badge">verified</span>}
        </div>
        <ul className="nav pt-2">
          <li className="nav-item">
            <a href="https://github.com/mrjackyliang/homebridge-adt-pulse" className="nav-link p-0" target="_blank" rel="noreferrer">GitHub</a>
          </li>
          <li className="nav-item">
            <a href="https://github.com/sponsors/mrjackyliang" className="nav-link p-0 ms-3" target="_blank" rel="noreferrer">Sponsor</a>
          </li>
          <li className="nav-item">
            <a href="https://github.com/mrjackyliang/homebridge-adt-pulse/issues/new/choose" className="nav-link p-0 ms-3" target="_blank" rel="noreferrer">Report an Issue</a>
          </li>
        </ul>
      </section>
      <section>
        <h5>System Information</h5>
        <div className="table-responsive">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th scope="row">Instance Name:</th>
                <td>
                  {information['instanceName']}
                </td>
              </tr>
              <tr>
                <th scope="row">Instance ID:</th>
                <td>
                  {information['instanceId']}
                </td>
              </tr>
              <tr>
                <th scope="row">Homebridge Version:</th>
                <td>
                  {information['homebridgeVersion']}
                </td>
              </tr>
              <tr>
                <th scope="row">Node.js Version</th>
                <td>
                  {information['nodeVersion']}
                </td>
              </tr>
              <tr>
                <th scope="row">Platform</th>
                <td>
                  {information['platform']}
                </td>
              </tr>
              <tr>
                <th scope="row">Running on:</th>
                <td>
                  {information['runningOn']}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="settings-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setView('setup')}
        >
          Restart Setup Wizard
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setView('settings-classic')}
        >
          Classic View
        </button>
      </section>
    </>
  );
}

export default SettingsPlugin;

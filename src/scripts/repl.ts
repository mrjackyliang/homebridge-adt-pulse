import repl from 'node:repl';

import chalk from 'chalk';

import { ADTPulseAPI } from '@/lib/api.js';
import { ADTPulseAuth } from '@/lib/auth.js';
import { debugLog } from '@/lib/utility.js';
import type {
  ADTPulseDisplayHelpHeaderReturns,
  ADTPulseDisplayHelpMenuReturns,
  ADTPulseDisplayStartupHeaderReturns,
  ADTPulseReplApi,
  ADTPulseReplAuth,
  ADTPulseReplReplServer,
  ADTPulseReplSetApiInstanceFingerprint,
  ADTPulseReplSetApiInstancePassword,
  ADTPulseReplSetApiInstanceReturns,
  ADTPulseReplSetApiInstanceSubdomain,
  ADTPulseReplSetApiInstanceUsername,
  ADTPulseReplSetAuthInstancePassword,
  ADTPulseReplSetAuthInstanceReturns,
  ADTPulseReplSetAuthInstanceSubdomain,
  ADTPulseReplSetAuthInstanceUsername,
} from '@/types/index.d.ts';

/**
 * ADT Pulse Repl.
 *
 * @since 1.0.0
 */
class ADTPulseRepl {
  /**
   * ADT Pulse Repl - Api.
   *
   * @private
   *
   * @since 1.0.0
   */
  #api: ADTPulseReplApi;

  /**
   * ADT Pulse Repl - Auth.
   *
   * @private
   *
   * @since 1.0.0
   */
  #auth: ADTPulseReplAuth;

  /**
   * ADT Pulse Repl - Repl server.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #replServer: ADTPulseReplReplServer;

  /**
   * ADT Pulse Repl - Constructor.
   *
   * @since 1.0.0
   */
  constructor() {
    ADTPulseRepl.displayStartupHeader();
    ADTPulseRepl.displayHelpMenu();

    // Start the REPL server.
    this.#replServer = repl.start({
      ignoreUndefined: true,
      prompt: '> ',
    });

    // Set the REPL server context on start-up.
    this.#replServer.context.repl = this;

    // Replace the default ".break" command.
    this.#replServer.defineCommand('break', {
      help: 'Sometimes you get stuck, this gets you out',
      action() {
        debugLog(null, 'repl.ts / ADTPulseRepl.startRepl()', 'error', 'The ".break" command is not allowed');
        this.displayPrompt();
      },
    });

    // Replace the default ".clear" command.
    this.#replServer.defineCommand('clear', {
      help: 'Break, and also clear the local context',
      action() {
        debugLog(null, 'repl.ts / ADTPulseRepl.startRepl()', 'error', 'The ".clear" command is not allowed');
        this.displayPrompt();
      },
    });

    // Replace the default ".editor" command.
    this.#replServer.defineCommand('editor', {
      help: 'Enter editor mode',
      action() {
        debugLog(null, 'repl.ts / ADTPulseRepl.startRepl()', 'error', 'The ".editor" command is not allowed');
        this.displayPrompt();
      },
    });

    // Replace the default ".help" command.
    this.#replServer.defineCommand('help', {
      help: 'Print this help message',
      action() {
        ADTPulseRepl.displayHelpHeader();
        ADTPulseRepl.displayHelpMenu();
        this.displayPrompt();
      },
    });

    // Replace the default ".load" command.
    this.#replServer.defineCommand('load', {
      help: 'Load JS from a file into the REPL session',
      action() {
        debugLog(null, 'repl.ts / ADTPulseRepl.startRepl()', 'error', 'The ".load" command is not allowed');
        this.displayPrompt();
      },
    });

    // Replace the default ".save" command.
    this.#replServer.defineCommand('save', {
      help: 'Save all evaluated commands in this REPL session to a file',
      action() {
        debugLog(null, 'repl.ts / ADTPulseRepl.startRepl()', 'error', 'The ".save" command is not allowed');
        this.displayPrompt();
      },
    });
  }

  /**
   * ADT Pulse Repl - Set api instance.
   *
   * @param {ADTPulseReplSetApiInstanceSubdomain}   subdomain   - Subdomain.
   * @param {ADTPulseReplSetApiInstanceUsername}    username    - Username.
   * @param {ADTPulseReplSetApiInstancePassword}    password    - Password.
   * @param {ADTPulseReplSetApiInstanceFingerprint} fingerprint - Fingerprint.
   *
   * @returns {ADTPulseReplSetApiInstanceReturns}
   *
   * @since 1.0.0
   */
  public setApiInstance(subdomain: ADTPulseReplSetApiInstanceSubdomain, username: ADTPulseReplSetApiInstanceUsername, password: ADTPulseReplSetApiInstancePassword, fingerprint: ADTPulseReplSetApiInstanceFingerprint): ADTPulseReplSetApiInstanceReturns {
    if (subdomain !== 'portal' && subdomain !== 'portal-ca') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'error', 'Invalid subdomain specified. Valid values are either "portal" or "portal-ca"');

      return;
    }

    if (typeof username !== 'string' || username === '') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'error', 'Username must be a string and cannot be empty');

      return;
    }

    if (typeof password !== 'string' || password === '') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'error', 'Password must be a string and cannot be empty');

      return;
    }

    if (typeof fingerprint !== 'string' || fingerprint === '') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'error', 'Fingerprint must be a string and cannot be empty');

      return;
    }

    // If the values are valid, set a new instance.
    this.#api = new ADTPulseAPI({
      platform: 'ADTPulse',
      name: 'ADT Pulse',
      subdomain,
      username,
      password,
      fingerprint,
      mode: 'normal',
      speed: 1,
      options: [],
      sensors: [],
    }, {
      debug: true,
    });

    // Check if "this.#replServer" was properly set during startup.
    if (this.#replServer === undefined) {
      debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'error', 'Failed to set API context because "this.#replServer" is undefined');

      return;
    }

    // Set the REPL server context after setting the instance.
    this.#replServer.context.api = this.#api;

    debugLog(null, 'repl.ts / ADTPulseRepl.setApiInstance()', 'success', 'API instance has been successfully set');
  }

  /**
   * ADT Pulse Repl - Set auth instance.
   *
   * @param {ADTPulseReplSetAuthInstanceSubdomain} subdomain - Subdomain.
   * @param {ADTPulseReplSetAuthInstanceUsername}  username  - Username.
   * @param {ADTPulseReplSetAuthInstancePassword}  password  - Password.
   *
   * @returns {ADTPulseReplSetAuthInstanceReturns}
   *
   * @since 1.0.0
   */
  public setAuthInstance(subdomain: ADTPulseReplSetAuthInstanceSubdomain, username: ADTPulseReplSetAuthInstanceUsername, password: ADTPulseReplSetAuthInstancePassword): ADTPulseReplSetAuthInstanceReturns {
    if (subdomain !== 'portal' && subdomain !== 'portal-ca') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setAuthInstance()', 'error', 'Invalid subdomain specified. Valid values are either "portal" or "portal-ca"');

      return;
    }

    if (typeof username !== 'string' || username === '') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setAuthInstance()', 'error', 'Username must be a string and cannot be empty');

      return;
    }

    if (typeof password !== 'string' || password === '') {
      debugLog(null, 'repl.ts / ADTPulseRepl.setAuthInstance()', 'error', 'Password must be a string and cannot be empty');

      return;
    }

    // If the values are valid, set a new instance.
    this.#auth = new ADTPulseAuth({
      subdomain,
      username,
      password,
    }, {
      debug: true,
    });

    // Check if "this.#replServer" was properly set during startup.
    if (this.#replServer === undefined) {
      debugLog(null, 'repl.ts / ADTPulseRepl.setAuthInstance()', 'error', 'Failed to set auth context because "this.#replServer" is undefined');

      return;
    }

    // Set the REPL server context after setting the instance.
    this.#replServer.context.auth = this.#auth;

    debugLog(null, 'repl.ts / ADTPulseRepl.setAuthInstance()', 'success', 'Auth instance has been successfully set');
  }

  /**
   * ADT Pulse Repl - Display help header.
   *
   * @returns {ADTPulseDisplayHelpHeaderReturns}
   *
   * @since 1.0.0
   */
  private static displayHelpHeader(): ADTPulseDisplayHelpHeaderReturns {
    console.info([
      chalk.cyanBright('##########################################################'),
      chalk.cyanBright('####  ADT Pulse for Homebridge Plugin REPL Help Menu  ####'),
      chalk.cyanBright('##########################################################'),
      '',
      'This is the help menu on how to use this REPL interface. If you have questions on how',
      'to use this, please refer to the documentation using the link below:',
      '',
      'https://github.com/mrjackyliang/homebridge-adt-pulse',
    ].join('\n'));
  }

  /**
   * ADT Pulse Repl - Display help menu.
   *
   * @returns {ADTPulseDisplayHelpMenuReturns}
   *
   * @since 1.0.0
   */
  private static displayHelpMenu(): ADTPulseDisplayHelpMenuReturns {
    console.info([
      '',
      chalk.bold('Method parameter documentation:'),
      `    {'portal' | 'portal-ca'}           ${chalk.magentaBright('subdomain')}     - Set the domain for either USA or Canada subscribers`,
      `    {string}                           ${chalk.magentaBright('username')}      - The username for logging in to ADT Pulse portal`,
      `    {string}                           ${chalk.magentaBright('password')}      - The password for logging in to ADT Pulse portal`,
      `    {string}                           ${chalk.magentaBright('fingerprint')}   - The fingerprint for logging in to ADT Pulse portal`,
      `    {'arm' | 'night' | 'off' | 'stay'} ${chalk.magentaBright('armFrom')}       - Specify the current system arm state`,
      `    {'arm' | 'night' | 'off' | 'stay'} ${chalk.magentaBright('armTo')}         - Specify the arm state you would like to set`,
      `    {boolean}                          ${chalk.magentaBright('isAlarmActive')} - If the alarm system is ringing`,
      `    {string}                           ${chalk.magentaBright('methodId')}      - Which device to request a verification code from (usually "SMS" or "EMAIL")`,
      `    {string}                           ${chalk.magentaBright('otpCode')}       - The one-time password code received from the verification method`,
      `    {string}                           ${chalk.magentaBright('deviceName')}    - The name to use when saving as a trusted device after verification`,
      '',
      chalk.bold('Before you use the API, set the instances using this command:'),
      `    ${chalk.yellowBright(`repl.setApiInstance(${chalk.magentaBright('subdomain')}, ${chalk.magentaBright('username')}, ${chalk.magentaBright('password')}, ${chalk.magentaBright('fingerprint')});`)}`,
      `    ${chalk.yellowBright(`repl.setAuthInstance(${chalk.magentaBright('subdomain')}, ${chalk.magentaBright('username')}, ${chalk.magentaBright('password')});`)}`,
      '',
      chalk.bold('Once the API instance is set, interact with the portal using these methods:'),
      `    ${chalk.yellowBright('await api.login();')}`,
      `    ${chalk.yellowBright('await api.logout();')}`,
      `    ${chalk.yellowBright('await api.getGatewayInformation();')}`,
      `    ${chalk.yellowBright('await api.getPanelInformation();')}`,
      `    ${chalk.yellowBright('await api.getPanelStatus();')}`,
      `    ${chalk.yellowBright(`await api.setPanelStatus(${chalk.magentaBright('armFrom')}, ${chalk.magentaBright('armTo')}, ${chalk.magentaBright('isAlarmActive')});`)}`,
      `    ${chalk.yellowBright('await api.getSensorsInformation();')}`,
      `    ${chalk.yellowBright('await api.getSensorsStatus();')}`,
      `    ${chalk.yellowBright('await api.getOrbSecurityButtons();')}`,
      `    ${chalk.yellowBright('await api.performSyncCheck();')}`,
      `    ${chalk.yellowBright('await api.performKeepAlive();')}`,
      `    ${chalk.yellowBright('      api.isAuthenticated();')}`,
      `    ${chalk.yellowBright('      api.resetSession();')}`,
      '',
      chalk.bold('Once the auth instance is set, interact with the portal using these methods:'),
      `    ${chalk.yellowBright('await auth.getVerificationMethods();')}`,
      `    ${chalk.yellowBright(`await auth.requestCode(${chalk.magentaBright('methodId')});`)}`,
      `    ${chalk.yellowBright(`await auth.validateCode(${chalk.magentaBright('otpCode')});`)}`,
      `    ${chalk.yellowBright('await auth.getTrustedDevices();')}`,
      `    ${chalk.yellowBright(`await auth.addTrustedDevice(${chalk.magentaBright('deviceName')});`)}`,
      `    ${chalk.yellowBright('await auth.completeSignIn();')}`,
      `    ${chalk.yellowBright('await auth.getSensors();')}`,
      `    ${chalk.yellowBright('      auth.getFingerprint();')}`,
      '',
      chalk.bold('You may also wrap the above methods with this to see the entire response:'),
      `    ${chalk.yellowBright(`console.log(util.inspect(${chalk.magentaBright('replace me without the ending semi-colon')}, false, null, true));`)}`,
      chalk.bold('A small reference for REPL commands:'),
      `    ${chalk.yellowBright('.exit')}`,
      `    ${chalk.yellowBright('.help')}`,
      '',
    ].join('\n'));
  }

  /**
   * ADT Pulse Repl - Display startup header.
   *
   * @returns {ADTPulseDisplayStartupHeaderReturns}
   *
   * @since 1.0.0
   */
  private static displayStartupHeader(): ADTPulseDisplayStartupHeaderReturns {
    console.info([
      chalk.cyanBright('################################################################'),
      chalk.cyanBright('####          ADT Pulse for Homebridge Plugin REPL          ####'),
      chalk.cyanBright('####  https://github.com/mrjackyliang/homebridge-adt-pulse  ####'),
      chalk.cyanBright('####                                                        ####'),
      chalk.cyanBright('####             Copyright (c) 2024 Jacky Liang             ####'),
      chalk.cyanBright('################################################################'),
      '',
      'Welcome to the REPL interface for ADT Pulse for Homebridge. This interface',
      'allows you to interact with the ADT Pulse portal via the included API and is designed',
      `for advanced users only. ${chalk.redBright('PLEASE USE WITH CAUTION, NO WARRANTY IS PROVIDED.')}`,
      '',
      `${chalk.yellowBright('NOTICE')}: The API gathers anonymous analytics to detect potential bugs or issues.`,
      '        All personally identifiable information will be redacted.',
    ].join('\n'));
  }
}

new ADTPulseRepl();

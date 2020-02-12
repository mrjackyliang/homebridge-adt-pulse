/**
 * ADT Pulse Test.
 *
 * Test the ADT Pulse API responses using this script.
 *
 * Arguments:
 *     --username email@email.com
 *     --password 1234567890
 *     --action   [device-information,device-status,zone-status,sync,disarm,arm-away,arm-stay,arm-night]
 *
 * Usage:
 *     node api-test --username ! --password % --action @
 *
 * Replace:
 *     ! - Account username
 *     % - Account password
 *     @ - Action type
 *
 * @type {function(object): void}
 *
 * @since 1.0.0
 */
const Pulse = require('./api');

/**
 * Script arguments.
 *
 * @since 1.0.0
 */
const username = process.argv.indexOf('--username');
const usernameValue = (username > -1) ? process.argv[username + 1] : '';

const password = process.argv.indexOf('--password');
const passwordValue = (password > -1) ? process.argv[password + 1] : '';

const action = process.argv.indexOf('--action');
const actionValue = (action > -1) ? process.argv[action + 1] : '';

/**
 * Sanitize arguments.
 *
 * @since 1.0.0
 */
if (!usernameValue || !passwordValue || !actionValue) {
  if (!usernameValue) {
    console.error('ADT Pulse Test: Username is empty.');
  }

  if (!passwordValue) {
    console.error('ADT Pulse Test: Password is empty.');
  }

  if (!actionValue) {
    console.error('ADT Pulse Test: Action is empty.');
  }

  return;
}

/**
 * Initialize main script.
 *
 * @type {Pulse}
 *
 * @since 1.0.0
 */
const pulse = new Pulse({
  username: usernameValue,
  password: passwordValue,
  debug: true,
});

/**
 * Actions.
 *
 * @since 1.0.0
 */
switch (actionValue) {
  case 'device-information':
    console.log('ADT Pulse Test: Getting device information...');

    pulse
      .login()
      .then((login) => console.log(login))
      .then(() => pulse.getDeviceInformation())
      .then((information) => console.log(information))
      .then(() => pulse.logout())
      .then((logout) => console.log(logout))
      .catch((error) => console.error(error));
    break;
  case 'device-status':
    console.log('ADT Pulse Test: Getting device status...');

    pulse
      .login()
      .then((login) => console.log(login))
      .then(() => pulse.getDeviceStatus())
      .then((status) => console.log(status))
      .then(() => pulse.logout())
      .then((logout) => console.log(logout))
      .catch((error) => console.error(error));
    break;
  case 'zone-status':
    console.log('ADT Pulse Test: Getting zone status...');

    pulse
      .login()
      .then((login) => console.log(login))
      .then(() => pulse.getZoneStatus())
      .then((statuses) => console.log(statuses))
      .then(() => pulse.logout())
      .then((logout) => console.log(logout))
      .catch((error) => console.error(error));
    break;
  case 'sync':
    console.log('ADT Pulse Test: Performing portal sync...');

    pulse
      .login()
      .then((login) => console.log(login))
      .then(() => pulse.performPortalSync())
      .then((syncCode) => console.log(syncCode))
      .then(() => pulse.logout())
      .then((logout) => console.log(logout))
      .catch((error) => console.error(error));
    break;
  case 'disarm':
    console.log('ADT Pulse Test: Disarming...');

    pulse
      .login()
      .then((login) => console.log(login))
      .then(() => pulse.getDeviceStatus())
      .then((status) => console.log(status))
      .then(async () => {
        /**
         * setDeviceStatus function may fail because a wrong armState was set.
         */
        await pulse
          .setDeviceStatus('away', 'off')
          .then((response) => console.log(response))
          .catch((error) => console.error(error));
      })
      .then(() => {
        setTimeout(() => {
          pulse
            .getDeviceStatus()
            .then((status) => console.log(status))
            .then(() => pulse.logout())
            .then((logout) => console.log(logout))
            .catch((error) => console.error(error));
        }, 1000);
      })
      .catch((error) => console.error(error));
    break;
  case 'arm-away':
    console.log('ADT Pulse Test: Arming away...');

    pulse
      .login()
      .then((login) => console.log(login))
      .then(() => pulse.getDeviceStatus())
      .then((status) => console.log(status))
      .then(async () => {
        /**
         * setDeviceStatus function may fail because a wrong armState was set.
         */
        await pulse
          .setDeviceStatus('disarmed', 'away')
          .then((response) => console.log(response))
          .catch((error) => console.error(error));
      })
      .then(() => {
        setTimeout(() => {
          pulse
            .getDeviceStatus()
            .then((status) => console.log(status))
            .then(() => pulse.logout())
            .then((logout) => console.log(logout))
            .catch((error) => console.error(error));
        }, 1000);
      })
      .catch((error) => console.error(error));
    break;
  case 'arm-stay':
    console.log('ADT Pulse Test: Arming stay...');

    pulse
      .login()
      .then((login) => console.log(login))
      .then(() => pulse.getDeviceStatus())
      .then((status) => console.log(status))
      .then(async () => {
        /**
         * setDeviceStatus function may fail because a wrong armState was set.
         */
        await pulse
          .setDeviceStatus('disarmed', 'stay')
          .then((response) => console.log(response))
          .catch((error) => console.error(error));
      })
      .then(() => {
        setTimeout(() => {
          pulse
            .getDeviceStatus()
            .then((status) => console.log(status))
            .then(() => pulse.logout())
            .then((logout) => console.log(logout))
            .catch((error) => console.error(error));
        }, 1000);
      })
      .catch((error) => console.error(error));
    break;
  case 'arm-night':
    console.log('ADT Pulse Test: Arming night...');

    pulse
      .login()
      .then((login) => console.log(login))
      .then(() => pulse.getDeviceStatus())
      .then((status) => console.log(status))
      .then(async () => {
        /**
         * setDeviceStatus function may fail because a wrong armState was set.
         */
        await pulse
          .setDeviceStatus('disarmed', 'night')
          .then((response) => console.log(response))
          .catch((error) => console.error(error));
      })
      .then(() => {
        setTimeout(() => {
          pulse
            .getDeviceStatus()
            .then((status) => console.log(status))
            .then(() => pulse.logout())
            .then((logout) => console.log(logout))
            .catch((error) => console.error(error));
        }, 1000);
      })
      .catch((error) => console.error(error));
    break;
  default:
    console.error(`ADT Pulse Test: Unknown action type ${actionValue}.`);
    break;
}

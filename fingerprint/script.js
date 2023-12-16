let errorGetCodeAlert;
let errorDeviceDetailsAlert;
let fingerprintDisplay;
let fingerprintEncoded;
let fingerprintResults;

/**
 * Copy to clipboard.
 *
 * @param {Element}         element - Element.
 * @param {('fingerprint')} type    - Type.
 *
 * @return {Promise<boolean>}
 *
 * @since 1.0.0
 */
async function copyToClipboard(element, type) {
  try {
    let textToCopy = '';

    switch (type) {
      case 'fingerprint':
        textToCopy = fingerprintEncoded;
        break;
      default:
        break;
    }

    await navigator.clipboard.writeText(textToCopy);

    // Disable the button after copying to clipboard.
    element.setAttribute('disabled', 'true');

    return true;
  } catch (error) {
    errorGetCodeAlert.removeAttribute('aria-hidden');
    errorGetCodeAlert.removeAttribute('style');

    console.error('Failed! Unable to copy text to clipboard.');
    console.debug('error:', error);

    return false;
  }
}

/**
 * Format object.
 *
 * @param {unknown} items - Items.
 *
 * @returns {string}
 *
 * @since 1.0.0
 */
function formatObject(items) {
  if (items == null || typeof items !== 'object') {
    return items;
  }

  return Object.entries(items)
    .map(([key, value]) => `<span class="fw-medium">${key}:</span> ${value}`)
    .join('<br />');
}

/**
 * Generate table rows.
 *
 * @param {object} items - Items.
 *
 * @returns {boolean}
 *
 * @since 1.0.0
 */
function generateTableRows(items) {
  const deviceDetailsTable = document.getElementById('device-details-table');

  // Check if the "device-details-table" element exists.
  if (deviceDetailsTable === null) {
    errorDeviceDetailsAlert.removeAttribute('aria-hidden');
    errorDeviceDetailsAlert.removeAttribute('style');

    console.error('Failed! The "device-details-table" element does not exist.');
    console.debug('deviceDetailsTable', deviceDetailsTable);

    return false;
  }

  // Go through each item, and create rows for them.
  Object.entries(items).forEach((item) => {
    const row = document.createElement('tr');
    const key = item[0];
    const value = formatObject(item[1]);

    row.innerHTML = `<td class="fw-medium">${key}</td><td>${value}</td>`;
    deviceDetailsTable.appendChild(row);
  });

  return true;
}

/**
 * Set error alert.
 *
 * @returns {boolean}
 *
 * @since 1.0.0
 */
function setErrorAlert() {
  const errorGetCodeTab = document.getElementById('error-get-code-tab');
  const errorDeviceDetailsTab = document.getElementById('error-device-details-tab');

  // Check if the "error-get-code-tab" element exists.
  if (errorGetCodeTab === null) {
    console.error('Failed! The "error-get-code-tab" element does not exist.');
    console.debug('errorGetCodeTab', errorGetCodeTab);

    return false;
  }

  // Check if the "error-device-details-tab" element exists.
  if (errorDeviceDetailsTab === null) {
    console.error('Failed! The "error-device-details-tab" element does not exist.');
    console.debug('errorDeviceDetailsTab', errorDeviceDetailsTab);

    return false;
  }

  // Set the error alert elements.
  errorGetCodeAlert = errorGetCodeTab;
  errorDeviceDetailsAlert = errorDeviceDetailsTab;

  return true;
}

/**
 * Set theme.
 *
 * @returns {boolean}
 *
 * @since 1.0.0
 */
function setTheme() {
  // Check if the user prefers dark mode.
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set the theme based on user preference.
  document.body.setAttribute('data-bs-theme', (prefersDarkMode) ? 'dark' : 'light');

  // Listen for changes to the browser theme.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);

  return true;
}

/**
 * Generate device fingerprint.
 *
 * @returns {boolean}
 *
 * @since 1.0.0
 */
function generateDeviceFingerprint() {
  const { secureAuth } = window;
  const { fingerprint } = secureAuth || {};
  const { getAllResults } = fingerprint || {};
  const fingerprintCode = document.getElementById('fingerprint-code');
  const rawCode = document.getElementById('raw-code');

  // Make sure the device fingerprint script is properly loaded.
  if (typeof secureAuth === 'undefined' || typeof fingerprint === 'undefined') {
    errorGetCodeAlert.removeAttribute('aria-hidden');
    errorGetCodeAlert.removeAttribute('style');
    errorDeviceDetailsAlert.removeAttribute('aria-hidden');
    errorDeviceDetailsAlert.removeAttribute('style');

    console.error('Failed! The device fingerprint script did not load properly.');
    console.debug('typeof secureAuth:', typeof secureAuth);
    console.debug('typeof fingerprint:', typeof fingerprint);

    return false;
  }

  // Make sure the "getAllResults()" function exists.
  if (!('getAllResults' in fingerprint) || typeof fingerprint.getAllResults !== 'function') {
    errorGetCodeAlert.removeAttribute('aria-hidden');
    errorGetCodeAlert.removeAttribute('style');
    errorDeviceDetailsAlert.removeAttribute('aria-hidden');
    errorDeviceDetailsAlert.removeAttribute('style');

    console.error('Failed! The "getAllResults()" function does not exist.');
    console.debug('\'getAllResults\' in fingerprint:', 'getAllResults' in fingerprint);
    console.debug('typeof fingerprint.getAllResults:', typeof fingerprint.getAllResults);

    return false;
  }

  // Set the fingerprint raw results and encoded versions.
  fingerprintResults = getAllResults();
  fingerprintDisplay = JSON.stringify(fingerprintResults, null, 2);
  fingerprintEncoded = btoa(JSON.stringify(fingerprintResults));

  // Check if the "fingerprint-code" element exists.
  if (fingerprintCode === null) {
    errorGetCodeAlert.removeAttribute('aria-hidden');
    errorGetCodeAlert.removeAttribute('style');
    errorDeviceDetailsAlert.removeAttribute('aria-hidden');
    errorDeviceDetailsAlert.removeAttribute('style');

    console.error('Failed! The "fingerprint-code" element does not exist.');
    console.debug('fingerprintCode', fingerprintCode);

    return false;
  }

  // Set the encoded fingerprint to the "Get Code" screen.
  fingerprintCode.textContent = fingerprintEncoded;

  // Generate a table for the "Device Details" screen.
  generateTableRows(fingerprintResults.fingerprint);

  // Set the displayable fingerprint to the "Device Details" screen.
  rawCode.textContent = fingerprintDisplay;

  return true;
}

/**
 * Set tab content.
 *
 * @returns {boolean}
 *
 * @since 1.0.0
 */
function setTabContent() {
  const tabContent = document.getElementById('tab-content');

  // Check if the "tab-content" element exists.
  if (tabContent === null) {
    errorGetCodeAlert.removeAttribute('aria-hidden');
    errorGetCodeAlert.removeAttribute('style');
    errorDeviceDetailsAlert.removeAttribute('aria-hidden');
    errorDeviceDetailsAlert.removeAttribute('style');

    console.error('Failed! The "tab-content" element does not exist.');
    console.debug('tabContent', tabContent);

    return false;
  }

  // Un-hide content.
  tabContent.removeAttribute('aria-hidden');
  tabContent.removeAttribute('style');

  return true;
}

// When the DOM has loaded.
document.addEventListener('DOMContentLoaded', () => {
  const run = [
    setErrorAlert,
    setTheme,
    generateDeviceFingerprint,
    setTabContent,
  ];

  // Run all the functions one by one.
  for (let i = 0; i < run.length; i += 1) {
    const currentFunc = run[i]();

    // If current function fails, stop loading.
    if (!currentFunc) {
      break;
    }
  }
});

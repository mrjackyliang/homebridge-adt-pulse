const errorGetCodeTab = document.getElementById('error-get-code-tab');
const errorDeviceDetailsTab = document.getElementById('error-device-details-tab');

// Where the fingerprint data would be stored.
let fingerprintDisplay;
let fingerprintEncoded;
let fingerprintResults;

/**
 * Copy to clipboard.
 *
 * @param {Element}         element - Element.
 * @param {('fingerprint')} type    - Type.
 *
 * @return {Promise<void>}
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
    element.disabled = true;
  } catch (error) {
    errorGetCodeTab.style.display = 'block';

    console.error('Failed! Unable to copy text to clipboard.');
    console.debug('error:', error);
  }
}

/**
 * Format object.
 *
 * @param {unknown} items - Items.
 *
 * @returns {*|string}
 *
 * @since 1.0.0
 */
function formatObject(items) {
  if (items == null || typeof items !== 'object') {
    return items;
  }

  return Object.entries(items).map(([key, value]) => `<span class="fw-medium">${key}:</span> ${value}`).join('<br />');
}

/**
 * Generate table rows.
 *
 * @param {object} items - Items.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
function generateTableRows(items) {
  const deviceDetailsTable = document.getElementById('device-details-table');

  // Check if the "deviceDetailsTable" element exists.
  if (deviceDetailsTable === null) {
    errorDeviceDetailsTab.style.display = 'block';

    console.error('Failed! The "deviceDetailsTable" element does not exist.');
    console.debug('deviceDetailsTable', deviceDetailsTable);

    return;
  }

  // Go through each item, and create rows for them.
  Object.entries(items).forEach((item) => {
    const row = document.createElement('tr');
    const key = item[0];
    const value = formatObject(item[1]);

    row.innerHTML = `<td class="fw-medium">${key}</td><td>${value}</td>`;
    deviceDetailsTable.appendChild(row);
  });
}

/**
 * Generate device fingerprint.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
function generateDeviceFingerprint() {
  const { secureAuth } = window;
  const { fingerprint } = secureAuth || {};
  const { getAllResults } = fingerprint || {};
  const fingerprintCode = document.getElementById('fingerprint-code');
  const rawCodeElement = document.getElementById('raw-code');

  // Make sure the device fingerprint script is properly loaded.
  if (typeof secureAuth === 'undefined' || typeof fingerprint === 'undefined') {
    errorGetCodeTab.style.display = 'block';
    errorDeviceDetailsTab.style.display = 'block';

    console.error('Failed! The device fingerprint script did not load properly.');
    console.debug('typeof secureAuth:', typeof secureAuth);
    console.debug('typeof fingerprint:', typeof fingerprint);

    return;
  }

  // Make sure the "getAllResults()" function exists.
  if (!('getAllResults' in fingerprint) || typeof fingerprint.getAllResults !== 'function') {
    errorGetCodeTab.style.display = 'block';
    errorDeviceDetailsTab.style.display = 'block';

    console.error('Failed! The "getAllResults()" function does not exist.');
    console.debug('\'getAllResults\' in fingerprint:', 'getAllResults' in fingerprint);
    console.debug('typeof fingerprint.getAllResults:', typeof fingerprint.getAllResults);

    return;
  }

  // Set the fingerprint raw results and encoded versions.
  fingerprintResults = getAllResults();
  fingerprintDisplay = JSON.stringify(fingerprintResults, null, 2);
  fingerprintEncoded = btoa(JSON.stringify(fingerprintResults));

  // Check if the "fingerprint-code" element exists.
  if (fingerprintCode === null) {
    errorGetCodeTab.style.display = 'block';
    errorDeviceDetailsTab.style.display = 'block';

    console.error('Failed! The "fingerprint-code" element does not exist.');
    console.debug('fingerprintCode', fingerprintCode);

    return;
  }

  // Set the encoded fingerprint to the "Get Code" screen.
  fingerprintCode.textContent = fingerprintEncoded;

  // Generate a table for the "Device Details" screen.
  generateTableRows(fingerprintResults.fingerprint);

  // Set the displayable fingerprint to the "Device Details" screen.
  rawCodeElement.textContent = fingerprintDisplay;
}

// Load the "generateDeviceFingerprint()" function when window loads.
window.onload = generateDeviceFingerprint;

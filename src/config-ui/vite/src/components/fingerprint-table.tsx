import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { styles } from '@/config-ui/vite/src/styles/components/fingerprint-table.js';
import type {
  FingerprintTableParsedObject,
  FingerprintTableProps,
  FingerprintTableRenderTableData,
  FingerprintTableRenderTablePropertyProperty,
  FingerprintTableRenderTablePropertyReturns,
  FingerprintTableRenderTableReturns,
  FingerprintTableRenderTableValueProperty,
  FingerprintTableRenderTableValueReturns,
  FingerprintTableRenderTableValueValue,
  FingerprintTableStatus,
} from '@/types/config-ui.d.ts';

/**
 * Fingerprint table.
 *
 * @constructor
 *
 * @since 1.0.0
 */
export default function FingerprintTable(props: FingerprintTableProps) {
  const { fingerprint } = props;

  const [parsedObject, setParsedObject] = useState<FingerprintTableParsedObject>({});
  const [status, setStatus] = useState<FingerprintTableStatus>('loading');

  /**
   * Fingerprint table - Render table property.
   *
   * @param {FingerprintTableRenderTablePropertyProperty} property - Property.
   *
   * @returns {FingerprintTableRenderTablePropertyReturns}
   *
   * @since 1.0.0
   */
  const renderTableProperty = (property: FingerprintTableRenderTablePropertyProperty): FingerprintTableRenderTablePropertyReturns => {
    const properties = {
      adBlock: 'Blocking Ads',
      addBehavior: 'Add Behaviour Support (IE only)',
      architecture: 'Architecture',
      availableScreenResolution: 'Available Screen Resolution',
      canvas: 'Canvas',
      colorDepth: 'Color Depth',
      cookieSupport: 'Cookie Support',
      cpuClass: 'CPU Class',
      doNotTrack: 'Do Not Track',
      fonts: 'Fonts',
      indexedDb: 'IndexedDB Support',
      language: 'Language',
      localStorage: 'Local Storage Support',
      major: 'Major',
      maxTouchPoints: 'Max Touch Points',
      model: 'Model',
      name: 'Name',
      openDatabase: 'Web SQL Database Support',
      pixelRatio: 'Pixel Ratio',
      platform: 'Platform',
      plugins: 'Plugins',
      screenResolution: 'Screen Resolution',
      sessionStorage: 'Session Storage Support',
      timezone: 'Time Zone',
      timezoneOffset: 'Time Zone (UTC Offset)',
      touchEvent: 'Touch Event',
      touchStart: 'Touch Start',
      touchSupport: 'Touch Support',
      type: 'Type',
      uaBrowser: 'Browser',
      uaCPU: 'CPU',
      uaDevice: 'Device',
      uaEngine: 'Browser Engine',
      uaOS: 'Operating System',
      uaPlatform: 'Platform',
      uaString: 'User Agent',
      userTamperBrowser: 'Tampered - Browser',
      userTamperLanguage: 'Tampered - Language',
      userTamperOS: 'Tampered - Operating System',
      userTamperScreenResolution: 'Tampered - Screen Resolution',
      vendor: 'Vendor',
      version: 'Version',
      webGl: 'WebGL',
    };

    return _.get(properties, [property], property);
  };

  /**
   * Fingerprint table - Render table value.
   *
   * @param {FingerprintTableRenderTableValueProperty} property - Property.
   * @param {FingerprintTableRenderTableValueValue}    value - Value.
   *
   * @returns {FingerprintTableRenderTableValueReturns}
   *
   * @since 1.0.0
   */
  const renderTableValue = (property: FingerprintTableRenderTableValueProperty, value: FingerprintTableRenderTableValueValue): FingerprintTableRenderTableValueReturns => {
    if (typeof value === 'string') {
      // If the selected properties have a comma-delimited list.
      if (['fonts', 'plugins'].includes(property)) {
        const items = value.split(',').map((item) => item.trim()).filter((item) => item.length > 0);

        return (
          <ul className="list-group">
            {
              items.map((item) => (
                <li key={item} className="list-group-item">{item}</li>
              ))
            }
          </ul>
        );
      }

      return value;
    }

    // If the value does not exist.
    if (value === null) {
      return 'N/A';
    }

    // If value is "true".
    if (value === true) {
      return 'Yes';
    }

    // If value is "false".
    if (value === false) {
      return 'No';
    }

    return JSON.stringify(value);
  };

  /**
   * Fingerprint table - Render table.
   *
   * @param {FingerprintTableRenderTableData} data - Data.
   *
   * @returns {FingerprintTableRenderTableReturns}
   *
   * @since 1.0.0
   */
  const renderTable = (data: FingerprintTableRenderTableData): FingerprintTableRenderTableReturns => {
    if (typeof data !== 'object' || data === null) {
      return <td>{data}</td>;
    }

    return (
      <table className="table table-bordered mb-0">
        <tbody>
          {
            Object.entries(data).map(([property, value]) => (
              <tr key={property}>
                <th scope="row" style={styles.tableHead}>{renderTableProperty(property)}</th>
                <td>
                  {
                    (typeof value === 'object' && value !== null) ? (
                      renderTable(value)
                    ) : (
                      renderTableValue(property, value)
                    )
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    try {
      const parsedFingerprint = JSON.parse(atob(fingerprint));

      // Valid fingerprints are always a plain object.
      if (!_.isPlainObject(parsedFingerprint)) {
        setStatus('failed');

        return;
      }

      setParsedObject(parsedFingerprint);
      setStatus('success');
    } catch {
      setStatus('failed');
    }
  }, [fingerprint]);

  // If parsing is successful.
  if (status === 'success') {
    return (
      <>
        <p className="alert alert-warning">The information shown below is for your eyes only. Fingerprints are considered your secondary password. Leaking this will compromise the MFA security to your ADT Pulse account.</p>
        <div className="table-responsive">
          {
            renderTable(_.get(parsedObject, ['fingerprint']))
          }
        </div>
      </>
    );
  }

  // If parsing has failed.
  if (status === 'failed') {
    return (
      <p className="alert alert-danger">Failed to parse your fingerprint. Please re-run the setup wizard.</p>
    );
  }

  return (
    <p className="alert alert-info">Parsing your fingerprint, please wait...</p>
  );
}

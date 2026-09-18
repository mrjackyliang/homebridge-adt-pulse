import bootstrapStylesheetUrl from 'bootstrap/dist/css/bootstrap.min.css?url';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { watch } from './lib/theme';
import Router from './router';
import pluginStyles from './styles/config-ui.css?inline';

import type {
  AdtPulseConfigInterfaceHomebridge,
  AdtPulseConfigInterfaceLink,
  AdtPulseConfigInterfaceMount,
  AdtPulseConfigInterfaceRoot,
  AdtPulseConfigInterfaceShadow,
  AdtPulseConfigInterfaceStartFrontendReturns,
  AdtPulseConfigInterfaceStyle,
} from './types/config-ui.d.ts';

/**
 * Index.
 *
 * Serves as the entry point for the plugin's custom configuration user interface.
 * It prepares the page environment and mounts the React application so users can
 * manage plugin settings from within the Homebridge UI.
 *
 * @since 1.0.0
 */
class ADTPulseConfigInterface {
  /**
   * ADT Pulse Config Interface - Homebridge.
   *
   * Holds the Homebridge plugin UI API object injected into the page by the
   * Homebridge UI. It provides access to toasts and other UI integrations.
   *
   * @private
   *
   * @since 1.0.0
   */
  #homebridge: AdtPulseConfigInterfaceHomebridge;

  /**
   * ADT Pulse Config Interface - Root.
   *
   * Holds the DOM element that React mounts into. Keeping a reference allows the
   * frontend to validate the mount point before rendering the application.
   *
   * @private
   *
   * @since 1.0.0
   */
  #root: AdtPulseConfigInterfaceRoot;

  /**
   * Index - Start Frontend.
   *
   * Bootstraps the configuration interface inside its own styling boundary.
   * This keeps Homebridge's CSS from changing the plugin's form controls.
   *
   * @returns {AdtPulseConfigInterfaceStartFrontendReturns}
   *
   * @since 1.0.0
   */
  public startFrontend(): AdtPulseConfigInterfaceStartFrontendReturns {
    this.#homebridge = window['homebridge'];
    this.#root = document.getElementById('root') ?? undefined;

    // Ensures React is able to mount to the "#root" element.
    if (this.#root === undefined) {
      if (this.#homebridge !== undefined) {
        this.#homebridge.toast.error('The "#root" element does not exist');
      }

      throw new Error('The "#root" element does not exist');
    }

    const shadow: AdtPulseConfigInterfaceShadow = this.#root.attachShadow({ mode: 'open' });
    const link: AdtPulseConfigInterfaceLink = document.createElement('link');
    const style: AdtPulseConfigInterfaceStyle = document.createElement('style');
    const mount: AdtPulseConfigInterfaceMount = document.createElement('main');

    link.rel = 'stylesheet';
    link.href = bootstrapStylesheetUrl;
    style.textContent = pluginStyles;
    mount.className = 'adt-pulse-app';
    mount.setAttribute('data-bs-theme', 'light');

    shadow.append(link, style, mount);

    if (this.#homebridge !== undefined) {
      watch(mount);
    }

    ReactDOM.createRoot(mount).render(
      <React.StrictMode>
        <Router homebridge={this.#homebridge} />
      </React.StrictMode>,
    );

    return;
  }
}

/**
 * Index - Instance.
 *
 * Bootstraps the configuration interface by instantiating it and starting the
 * frontend, mounting the React application inside the Homebridge UI.
 *
 * @since 1.0.0
 */
const instance = new ADTPulseConfigInterface();

instance.startFrontend();

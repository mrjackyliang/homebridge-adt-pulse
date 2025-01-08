import React from 'react';
import ReactDOM from 'react-dom/client';

import Router from '@/config-ui/vite/src/router';
import type {
  ADTPulseConfigInterfaceHomebridge,
  ADTPulseConfigInterfaceLoadBootstrapReturns,
  ADTPulseConfigInterfaceLoadBootstrapScripts,
  ADTPulseConfigInterfaceObserveThemeReturns,
  ADTPulseConfigInterfaceRoot,
  ADTPulseConfigInterfaceStartFrontendReturns,
} from '@/types/config-ui.d.ts';

/**
 * ADT Pulse Config Interface.
 *
 * @since 1.0.0
 */
class ADTPulseConfigInterface {
  /**
   * ADT Pulse Config Interface - Homebridge.
   *
   * @private
   *
   * @since 1.0.0
   */
  #homebridge: ADTPulseConfigInterfaceHomebridge;

  /**
   * ADT Pulse Config Interface - Root.
   *
   * @private
   *
   * @since 1.0.0
   */
  #root: ADTPulseConfigInterfaceRoot;

  /**
   * ADT Pulse Config Interface - Start frontend.
   *
   * @returns {ADTPulseConfigInterfaceStartFrontendReturns}
   *
   * @since 1.0.0
   */
  public startFrontend(): ADTPulseConfigInterfaceStartFrontendReturns {
    this.#homebridge = window.homebridge;
    this.#root = document.getElementById('root') ?? undefined;

    // Helper scripts for Bootstrap 5.
    ADTPulseConfigInterface.loadBootstrap();

    // Observe browser light/dark mode theme.
    ADTPulseConfigInterface.observeTheme();

    // Ensures React is able to mount to the "#root" element.
    if (this.#root === undefined) {
      if (this.#homebridge !== undefined) {
        this.#homebridge.toast.error('The "#root" element does not exist');
      }

      throw new Error('The "#root" element does not exist');
    }

    ReactDOM.createRoot(this.#root).render(
      <React.StrictMode>
        <Router homebridge={this.#homebridge} />
      </React.StrictMode>,
    );
  }

  /**
   * ADT Pulse Config Interface - Load bootstrap.
   *
   * @private
   *
   * @returns {ADTPulseConfigInterfaceLoadBootstrapReturns}
   *
   * @since 1.0.0
   */
  private static loadBootstrap(): ADTPulseConfigInterfaceLoadBootstrapReturns {
    const scripts: ADTPulseConfigInterfaceLoadBootstrapScripts = [
      {
        element: 'link',
        params: [
          ['rel', 'stylesheet'],
          ['href', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'],
          ['integrity', 'sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH'],
          ['crossorigin', 'anonymous'],
        ],
      },
      {
        element: 'link',
        params: [
          ['rel', 'stylesheet'],
          ['href', 'style.css'],
        ],
      },
      {
        element: 'script',
        params: [
          ['src', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'],
          ['integrity', 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz'],
          ['crossorigin', 'anonymous'],
        ],
      },
    ];

    // Add scripts to the "<head>" of the document.
    scripts.forEach((script) => {
      const element = document.createElement(script.element);

      script.params.forEach((param) => {
        element.setAttribute(param[0], param[1]);
      });

      document.head.append(element);
    });
  }

  /**
   * ADT Pulse Config Interface - Observe theme.
   *
   * @private
   *
   * @returns {ADTPulseConfigInterfaceObserveThemeReturns}
   *
   * @since 1.0.0
   */
  private static observeTheme(): ADTPulseConfigInterfaceObserveThemeReturns {
    const observer = new MutationObserver(() => {
      const documentBodyClassName = document.body.className;

      if (documentBodyClassName.includes('dark-mode')) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
      }
    });

    // Checks if the body's classes have changed.
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
}

const instance = new ADTPulseConfigInterface();
instance.startFrontend();

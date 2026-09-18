import type {
  Lib_Theme_Watch_HeadObserver,
  Lib_Theme_Watch_Mount,
  Lib_Theme_Watch_Observer,
  Lib_Theme_Watch_Returns,
  Lib_Theme_Watch_SourceDocument,
  Lib_Theme_Watch_Synchronize,
  Lib_Theme_Watch_Synchronize_Accent,
  Lib_Theme_Watch_Synchronize_AccentContrast,
  Lib_Theme_Watch_Synchronize_CreatedProbe,
  Lib_Theme_Watch_Synchronize_CurrentTheme,
  Lib_Theme_Watch_Synchronize_IsDark,
  Lib_Theme_Watch_Synchronize_Probe,
  Lib_Theme_Watch_Synchronize_Style,
  Lib_Theme_Watch_Synchronize_ThemeClasses,
} from '../types/lib/theme.d.ts';

/**
 * Lib - Theme - Watch.
 *
 * Mirrors the Homebridge theme inside the plugin's isolated style boundary.
 * Reads the live parent theme when the iframe shares Homebridge's origin.
 * Falls back to Homebridge's mirrored iframe classes in other environments.
 *
 * @param {Lib_Theme_Watch_Mount} mount - Mount.
 *
 * @returns {Lib_Theme_Watch_Returns}
 *
 * @since 3.5.0
 */
export function watch(mount: Lib_Theme_Watch_Mount): Lib_Theme_Watch_Returns {
  let sourceDocument: Lib_Theme_Watch_SourceDocument = document;

  try {
    if (window.parent !== window) {
      sourceDocument = window.parent.document;
    }
  } catch {
    // A cross-origin development server can still use mirrored iframe classes.
  }

  /**
   * Lib - Theme - Watch - Synchronize.
   *
   * Updates the isolated palette whenever Homebridge changes theme classes.
   * Sampling the host's button lets new Homebridge accent palettes work too.
   *
   * @since 3.5.0
   */
  const synchronize: Lib_Theme_Watch_Synchronize = () => {
    const themeClasses: Lib_Theme_Watch_Synchronize_ThemeClasses = [...sourceDocument.body.classList]
      .filter((className) => className.startsWith('config-ui-x-'));
    const currentTheme: Lib_Theme_Watch_Synchronize_CurrentTheme = themeClasses.at(-1);

    // The mirrored iframe can retain old theme classes; the parent is the
    // authoritative source and does not need to be modified.
    if (sourceDocument === document) {
      for (const themeClass of themeClasses) {
        if (themeClass !== currentTheme) {
          document.body.classList.remove(themeClass);
        }
      }
    }

    const isDark: Lib_Theme_Watch_Synchronize_IsDark = currentTheme !== undefined && currentTheme.includes('dark-mode') === true;

    mount.setAttribute('data-bs-theme', (isDark === true) ? 'dark' : 'light');

    // Sample a host-owned primary button when possible. This picks up new
    // Homebridge accent palettes without keeping a manual color table.
    let probe: Lib_Theme_Watch_Synchronize_Probe = sourceDocument.querySelector('.btn-primary');
    const createdProbe: Lib_Theme_Watch_Synchronize_CreatedProbe = probe === null;

    if (probe === null) {
      probe = sourceDocument.createElement('button');
      probe.className = 'btn btn-primary';
      probe.style.position = 'fixed';
      probe.style.visibility = 'hidden';
      sourceDocument.body.append(probe);
    }

    const style: Lib_Theme_Watch_Synchronize_Style = (sourceDocument.defaultView ?? window).getComputedStyle(probe);
    const accent: Lib_Theme_Watch_Synchronize_Accent = style.backgroundColor;
    const accentContrast: Lib_Theme_Watch_Synchronize_AccentContrast = style.color;

    if (createdProbe === true) {
      probe.remove();
    }

    // A native button color means Homebridge's copied stylesheet has not loaded
    // yet. Wait for its load event instead of mistaking that color for a theme.
    if (style.getPropertyValue('--bs-btn-bg').trim() === '') {
      return;
    }

    if (accent.startsWith('rgb(') === true) {
      mount.style.setProperty('--adt-accent', accent);
    }

    if (accentContrast.startsWith('rgb(') === true) {
      mount.style.setProperty('--adt-accent-contrast', accentContrast);
    }

    return;
  };

  const observer: Lib_Theme_Watch_Observer = new MutationObserver(synchronize);
  const headObserver: Lib_Theme_Watch_HeadObserver = new MutationObserver(synchronize);

  observer.observe(sourceDocument.body, {
    attributes: true,
    attributeFilter: ['class'],
  });

  headObserver.observe(sourceDocument.head, { childList: true });

  sourceDocument.head.addEventListener('load', synchronize, true);

  window.addEventListener('load', synchronize);

  synchronize();

  return () => {
    observer.disconnect();

    headObserver.disconnect();

    sourceDocument.head.removeEventListener('load', synchronize, true);

    window.removeEventListener('load', synchronize);

    return;
  };
}

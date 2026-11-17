import {
  BlogPreview, BrowserFrame, Canvas, Features, InstallStrip, Showcase, Spotlight,
} from '@cbnventures/docusaurus-preset-nova/blocks';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { Icon } from '@iconify/react';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import ThemedImage from '@theme/ThemedImage';

import configUiGeneralOneDark from './_assets_/home-config-ui-general-1-dark.webp';
import configUiGeneralOneLight from './_assets_/home-config-ui-general-1-light.webp';
import configUiLoginOneDark from './_assets_/home-config-ui-login-1-dark.webp';
import configUiLoginOneLight from './_assets_/home-config-ui-login-1-light.webp';
import configUiSensorsOneDark from './_assets_/home-config-ui-sensors-1-dark.webp';
import configUiSensorsOneLight from './_assets_/home-config-ui-sensors-1-light.webp';

import styles from './index.module.css';

import type { Pages_Index_Home_Returns } from '../types/pages/index.d.ts';

/**
 * Pages - Home.
 *
 * Root landing page that composes the hero header, install strip,
 * feature grid, and blog preview using theme blocks.
 *
 * @constructor
 *
 * @returns {Pages_Index_Home_Returns}
 *
 * @since 0.0.0
 */
function Home(): Pages_Index_Home_Returns {
  return (
    <Layout description={translate({
      id: 'home.layout.description',
      message: 'Control your ADT Pulse security system from the Apple Home app with full panel control, nine sensor types, and a guided setup wizard.',
      description: 'Front page layout description (meta description for SEO)',
    })}
    >
      <Head>
        <title>
          {translate({
            id: 'home.head.title',
            message: 'ADT Pulse for Homebridge - ADT Pulse, meet Apple Home',
            description: 'Front page browser tab title',
          })}
        </title>
      </Head>
      <Canvas container="full" className={styles['hero']}>
        <div className={styles['heroInner']}>
          <div className={styles['heroContent']}>
            <p className="nova-hero-eyebrow">
              {translate({
                id: 'home.hero.eyebrow',
                message: 'Homebridge Plugin',
                description: 'Front page hero eyebrow above the heading',
              })}
            </p>
            <Heading as="h1" className="nova-hero-heading">
              {translate({
                id: 'home.hero.heading',
                message: 'ADT Pulse, meet Apple Home.',
                description: 'Front page hero main heading',
              })}
            </Heading>
            <p className="nova-hero-tagline">
              {translate({
                id: 'home.hero.tagline',
                message: 'Bring your ADT Pulse security system into the Apple Home app with full panel control, nine sensor types, and a guided setup wizard.',
                description: 'Front page hero tagline beneath the heading',
              })}
            </p>
            <div className={`nova-hero-actions ${styles['heroActions']}`}>
              <Link
                className="nova-cta-primary"
                to="/docs/getting-started/installation/"
              >
                {translate({
                  id: 'home.hero.ctaLabel',
                  message: 'Get Started',
                  description: 'Front page hero primary call-to-action button label',
                })}
              </Link>
              <Link
                className="nova-cta-secondary"
                to="/docs/overview/"
              >
                {translate({
                  id: 'home.hero.secondaryCtaLabel',
                  message: 'Learn More',
                  description: 'Front page hero secondary call-to-action button label',
                })}
              </Link>
            </div>
          </div>
          <div className={styles['homeRoom']} aria-hidden="true">
            <div className={styles['panelTile']}>
              <Icon icon="lucide:shield-check" className={styles['panelTileIcon']} />
              <div className={styles['panelTileInfo']}>
                <span className={styles['panelTileName']}>Security System</span>
                <span className={styles['panelTileState']}>Disarmed</span>
              </div>
              <span className={styles['panelTileDot']} />
            </div>
            <div className={styles['sensorGrid']}>
              <div className={styles['sensorTile']}>
                <div className={styles['sensorTileTop']}>
                  <Icon icon="lucide:door-closed" className={styles['sensorTileIcon']} />
                  <span className={`${styles['sensorTileDot']} ${styles['dotOk']}`} />
                </div>
                <div className={styles['sensorTileBottom']}>
                  <span className={styles['sensorTileName']}>Door / Window</span>
                  <span className={`${styles['sensorTileStatus']} ${styles['statusOk']}`}>Closed</span>
                </div>
              </div>
              <div className={`${styles['sensorTile']} ${styles['sensorTileActive']}`}>
                <div className={styles['sensorTileTop']}>
                  <Icon icon="lucide:radar" className={`${styles['sensorTileIcon']} ${styles['iconActive']}`} />
                  <span className={`${styles['sensorTileDot']} ${styles['dotActive']}`} />
                </div>
                <div className={styles['sensorTileBottom']}>
                  <span className={styles['sensorTileName']}>Motion</span>
                  <span className={`${styles['sensorTileStatus']} ${styles['statusActive']}`}>Detected</span>
                </div>
              </div>
              <div className={styles['sensorTile']}>
                <div className={styles['sensorTileTop']}>
                  <Icon icon="lucide:cloud" className={styles['sensorTileIcon']} />
                  <span className={`${styles['sensorTileDot']} ${styles['dotOk']}`} />
                </div>
                <div className={styles['sensorTileBottom']}>
                  <span className={styles['sensorTileName']}>Carbon Monoxide</span>
                  <span className={`${styles['sensorTileStatus']} ${styles['statusOk']}`}>Normal</span>
                </div>
              </div>
              <div className={styles['sensorTile']}>
                <div className={styles['sensorTileTop']}>
                  <Icon icon="lucide:flame" className={styles['sensorTileIcon']} />
                  <span className={`${styles['sensorTileDot']} ${styles['dotOk']}`} />
                </div>
                <div className={styles['sensorTileBottom']}>
                  <span className={styles['sensorTileName']}>Fire</span>
                  <span className={`${styles['sensorTileStatus']} ${styles['statusOk']}`}>Normal</span>
                </div>
              </div>
              <div className={styles['sensorTile']}>
                <div className={styles['sensorTileTop']}>
                  <Icon icon="lucide:droplets" className={styles['sensorTileIcon']} />
                  <span className={`${styles['sensorTileDot']} ${styles['dotOk']}`} />
                </div>
                <div className={styles['sensorTileBottom']}>
                  <span className={styles['sensorTileName']}>Flood</span>
                  <span className={`${styles['sensorTileStatus']} ${styles['statusOk']}`}>Normal</span>
                </div>
              </div>
              <div className={styles['sensorTile']}>
                <div className={styles['sensorTileTop']}>
                  <Icon icon="lucide:shield-alert" className={styles['sensorTileIcon']} />
                  <span className={`${styles['sensorTileDot']} ${styles['dotOk']}`} />
                </div>
                <div className={styles['sensorTileBottom']}>
                  <span className={styles['sensorTileName']}>Glass Break</span>
                  <span className={`${styles['sensorTileStatus']} ${styles['statusOk']}`}>Normal</span>
                </div>
              </div>
              <div className={styles['sensorTile']}>
                <div className={styles['sensorTileTop']}>
                  <Icon icon="lucide:sun" className={styles['sensorTileIcon']} />
                  <span className={`${styles['sensorTileDot']} ${styles['dotOk']}`} />
                </div>
                <div className={styles['sensorTileBottom']}>
                  <span className={styles['sensorTileName']}>Heat</span>
                  <span className={`${styles['sensorTileStatus']} ${styles['statusOk']}`}>Normal</span>
                </div>
              </div>
              <div className={styles['sensorTile']}>
                <div className={styles['sensorTileTop']}>
                  <Icon icon="lucide:zap" className={styles['sensorTileIcon']} />
                  <span className={`${styles['sensorTileDot']} ${styles['dotOk']}`} />
                </div>
                <div className={styles['sensorTileBottom']}>
                  <span className={styles['sensorTileName']}>Shock</span>
                  <span className={`${styles['sensorTileStatus']} ${styles['statusOk']}`}>Normal</span>
                </div>
              </div>
              <div className={styles['sensorTile']}>
                <div className={styles['sensorTileTop']}>
                  <Icon icon="lucide:thermometer" className={styles['sensorTileIcon']} />
                  <span className={`${styles['sensorTileDot']} ${styles['dotOk']}`} />
                </div>
                <div className={styles['sensorTileBottom']}>
                  <span className={styles['sensorTileName']}>Temperature</span>
                  <span className={`${styles['sensorTileStatus']} ${styles['statusOk']}`}>72&deg;F</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Canvas>
      <main>
        <InstallStrip command="npm install homebridge-adt-pulse" />
        <Features
          items={[
            {
              icon: 'lucide:shield',
              title: translate({
                id: 'home.features.panelControl.title',
                message: 'Full Panel Control',
                description: 'Front page Features card title for Full Panel Control',
              }),
              description: translate({
                id: 'home.features.panelControl.description',
                message: 'Arm Away, Arm Stay, Arm Night, and Disarm from the Home app, including Arm Night mode that the ADT Pulse Web Portal and mobile app do not expose.',
                description: 'Front page Features card description for Full Panel Control',
              }),
            },
            {
              icon: 'lucide:radio',
              title: translate({
                id: 'home.features.sensorTypes.title',
                message: 'Nine Sensor Types',
                description: 'Front page Features card title for Nine Sensor Types',
              }),
              description: translate({
                id: 'home.features.sensorTypes.description',
                message: 'Carbon monoxide, door/window, fire, flood, glass break, heat, motion, shock, and temperature sensors surface as read-only HomeKit accessories.',
                description: 'Front page Features card description for Nine Sensor Types',
              }),
            },
            {
              icon: 'lucide:wand-2',
              title: translate({
                id: 'home.features.setupWizard.title',
                message: 'Guided Setup Wizard',
                description: 'Front page Features card title for Guided Setup Wizard',
              }),
              description: translate({
                id: 'home.features.setupWizard.description',
                message: 'A custom config UI logs into the portal, handles SMS or email verification, registers a trusted device, and retrieves the device fingerprint.',
                description: 'Front page Features card description for Guided Setup Wizard',
              }),
            },
            {
              icon: 'lucide:bell-ring',
              title: translate({
                id: 'home.features.alarmSwitch.title',
                message: 'Alarm Ringing Switch',
                description: 'Front page Features card title for Alarm Ringing Switch',
              }),
              description: translate({
                id: 'home.features.alarmSwitch.description',
                message: 'A dedicated switch for silencing a ringing alarm while the system is in Disarmed mode, removable through advanced options.',
                description: 'Front page Features card description for Alarm Ringing Switch',
              }),
            },
            {
              icon: 'lucide:gauge',
              title: translate({
                id: 'home.features.operationalModes.title',
                message: 'Operational Modes',
                description: 'Front page Features card title for Operational Modes',
              }),
              description: translate({
                id: 'home.features.operationalModes.description',
                message: 'Normal, Paused, and Reset modes plus four synchronization speeds to accommodate older hardware and constrained networks.',
                description: 'Front page Features card description for Operational Modes',
              }),
            },
            {
              icon: 'lucide:eye',
              title: translate({
                id: 'home.features.anomalyDetection.title',
                message: 'Anomaly Detection',
                description: 'Front page Features card title for Anomaly Detection',
              }),
              description: translate({
                id: 'home.features.anomalyDetection.description',
                message: 'Undocumented portal statuses are reported so support can be added, with personally identifiable information automatically redacted.',
                description: 'Front page Features card description for Anomaly Detection',
              }),
            },
          ]}
        />
        <Spotlight
          surface="alt"
          className={styles['shotSpotlight']}
          heading={translate({
            id: 'home.showcase.heading',
            message: 'Set Up From the Homebridge UI',
            description: 'Front page heading above the Homebridge UI screenshots',
          })}
        >
          <Showcase
            tabsLabel={translate({
              id: 'home.showcase.tabsLabel',
              message: 'Plugin settings tabs',
              description: 'Accessible label for the screenshot tabs on the front page',
            })}
            items={[
              {
                label: translate({
                  id: 'home.showcase.general.label',
                  message: 'General',
                  description: 'Front page screenshot tab for the General settings',
                }),
                heading: translate({
                  id: 'home.showcase.general.heading',
                  message: 'Settings right inside Homebridge',
                  description: 'Front page heading for the General settings screenshot',
                }),
                description: translate({
                  id: 'home.showcase.general.description',
                  message: 'Change the plugin\'s name, operational mode, sync speed, and advanced options from the plugin\'s settings in the Homebridge UI, with no JSON to edit.',
                  description: 'Front page description for the General settings screenshot',
                }),
                link: {
                  label: translate({
                    id: 'home.showcase.general.link',
                    message: 'Choose an Operational Mode',
                    description: 'Front page link from the General settings screenshot to its guide',
                  }),
                  to: '/docs/configuration/operational-mode/',
                },
                content: (
                  <BrowserFrame title="Homebridge" url="homebridge.local:8581/plugins" favicon="/images/homebridge-favicon.ico">
                    <ThemedImage
                      sources={{
                        light: configUiGeneralOneLight,
                        dark: configUiGeneralOneDark,
                      }}
                      alt={translate({
                        id: 'home.showcase.general.alt',
                        message: 'The plugin\'s General settings in the Homebridge UI, with name, operational mode, synchronization speed, and advanced options',
                        description: 'Alt text for the General settings screenshot on the front page',
                      })}
                      width={1280}
                      height={800}
                    />
                  </BrowserFrame>
                ),
              },
              {
                label: translate({
                  id: 'home.showcase.login.label',
                  message: 'Login',
                  description: 'Front page screenshot tab for the Login settings',
                }),
                heading: translate({
                  id: 'home.showcase.login.heading',
                  message: 'Sign in with your portal account',
                  description: 'Front page heading for the Login settings screenshot',
                }),
                description: translate({
                  id: 'home.showcase.login.description',
                  message: 'Pick the portal region you subscribe in, then enter the username and password you use for the ADT Pulse portal.',
                  description: 'Front page description for the Login settings screenshot',
                }),
                link: {
                  label: translate({
                    id: 'home.showcase.login.link',
                    message: 'Pick a Portal Region',
                    description: 'Front page link from the Login settings screenshot to its guide',
                  }),
                  to: '/docs/getting-started/portal-region/',
                },
                content: (
                  <BrowserFrame title="Homebridge" url="homebridge.local:8581/plugins" favicon="/images/homebridge-favicon.ico">
                    <ThemedImage
                      sources={{
                        light: configUiLoginOneLight,
                        dark: configUiLoginOneDark,
                      }}
                      alt={translate({
                        id: 'home.showcase.login.alt',
                        message: 'The plugin\'s Login settings in the Homebridge UI, with portal region, username, and password',
                        description: 'Alt text for the Login settings screenshot on the front page',
                      })}
                      width={1280}
                      height={800}
                    />
                  </BrowserFrame>
                ),
              },
              {
                label: translate({
                  id: 'home.showcase.sensors.label',
                  message: 'Sensors',
                  description: 'Front page screenshot tab for the Sensors settings',
                }),
                heading: translate({
                  id: 'home.showcase.sensors.heading',
                  message: 'Every sensor, by name and zone',
                  description: 'Front page heading for the Sensors settings screenshot',
                }),
                description: translate({
                  id: 'home.showcase.sensors.description',
                  message: 'List each ADT sensor with its name, zone, and type, and it shows up in Apple Home as its own accessory.',
                  description: 'Front page description for the Sensors settings screenshot',
                }),
                link: {
                  label: translate({
                    id: 'home.showcase.sensors.link',
                    message: 'Set Up Sensors',
                    description: 'Front page link from the Sensors settings screenshot to its guide',
                  }),
                  to: '/docs/configuration/sensors-and-zones/',
                },
                content: (
                  <BrowserFrame title="Homebridge" url="homebridge.local:8581/plugins" favicon="/images/homebridge-favicon.ico">
                    <ThemedImage
                      sources={{
                        light: configUiSensorsOneLight,
                        dark: configUiSensorsOneDark,
                      }}
                      alt={translate({
                        id: 'home.showcase.sensors.alt',
                        message: 'The plugin\'s Sensors settings in the Homebridge UI, listing four sensors with their names',
                        description: 'Alt text for the Sensors settings screenshot on the front page',
                      })}
                      width={1280}
                      height={800}
                    />
                  </BrowserFrame>
                ),
              },
            ]}
          />
        </Spotlight>
        <BlogPreview
          heading={translate({
            id: 'home.blogPreview.heading',
            message: 'From the Blog',
            description: 'Front page Blog Preview section heading',
          })}
          description={translate({
            id: 'home.blogPreview.description',
            message: 'Launches, milestones, and what\'s new in ADT Pulse for Homebridge.',
            description: 'Front page Blog Preview section description',
          })}
          auto={true}
          limit={3}
          sort="newest"
        />
      </main>
    </Layout>
  );
}

export default Home;

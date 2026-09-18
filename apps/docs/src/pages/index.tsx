import {
  Canvas, Features, InstallStrip, Stats,
} from '@cbnventures/docusaurus-preset-nova/blocks';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { Icon } from '@iconify/react';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

import styles from './index.module.css';

/**
 * Pages - Home.
 *
 * Root landing page that composes the hero header, feature grid,
 * and stats section using theme blocks.
 *
 * @constructor
 *
 * @since 0.0.0
 */
function Home() {
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
            message: 'Homebridge ADT Pulse - ADT Pulse, meet Apple Home',
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
                to="/docs/overview/"
              >
                {translate({
                  id: 'home.hero.ctaLabel',
                  message: 'Get Started',
                  description: 'Front page hero primary call-to-action button label',
                })}
              </Link>
              <Link
                className="nova-cta-secondary"
                to="https://github.com/mrjackyliang/homebridge-adt-pulse"
              >
                {translate({
                  id: 'home.hero.secondaryCtaLabel',
                  message: 'View on GitHub',
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
      <InstallStrip command="npm install homebridge-adt-pulse" />
      <main>
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
        <Stats
          heading={translate({
            id: 'home.stats.heading',
            message: 'By the Numbers',
            description: 'Front page Stats section heading',
          })}
          items={[
            {
              value: '4',
              label: translate({
                id: 'home.stats.panelStates.label',
                message: 'Panel states',
                description: 'Front page Stats label for panel states count',
              }),
              color: 'primary',
            },
            {
              value: '9',
              label: translate({
                id: 'home.stats.sensorTypes.label',
                message: 'Sensor types',
                description: 'Front page Stats label for sensor types count',
              }),
              color: 'accent',
            },
            {
              value: '2',
              label: translate({
                id: 'home.stats.portalRegions.label',
                message: 'Portal regions',
                description: 'Front page Stats label for portal regions count',
              }),
              color: 'primary',
            },
            {
              value: '1',
              label: translate({
                id: 'home.stats.setupWizard.label',
                message: 'Setup wizard',
                description: 'Front page Stats label for setup wizard count',
              }),
              color: 'accent',
            },
          ]}
        />
      </main>
    </Layout>
  );
}

export default Home;

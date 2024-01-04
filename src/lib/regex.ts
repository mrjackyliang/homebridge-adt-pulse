/**
 * Character backslash forward slash.
 *
 * @since 1.0.0
 */
export const characterBackslashForwardSlash = /\\\//g;

/**
 * Character html line break.
 *
 * @since 1.0.0
 */
export const characterHtmlLineBreak = /<br( ?\/)?>/;

/**
 * Character whitespace.
 *
 * @since 1.0.0
 */
export const characterWhitespace = /\s+/g;

/**
 * Function do submit.
 *
 * @since 1.0.0
 */
export const functionDoSubmit = /doSubmit\(\s*'([^']+)\?sat=([^']+)&href=([^&]+)(&armstate=([^&]+)&arm=([^']+))?'\s*\)/;

/**
 * Function go to url.
 *
 * @since 1.0.0
 */
export const functionGoToUrl = /^goToUrl\('device\.jsp\?id=([0-9]+)'\);$/;

/**
 * Function set arm state.
 *
 * @since 1.0.0
 */
export const functionSetArmState = /setArmState\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'href=([^']+)&armstate=([^&]+)&arm=([^&]+)&sat=([^']+?)'\s*\)/;

/**
 * Param network id.
 *
 * @since 1.0.0
 */
export const paramNetworkId = /[?&]networkid=([^&#']*)/;

/**
 * Param sat.
 *
 * @since 1.0.0
 */
export const paramSat = /sat=([^&']*)/;

/**
 * Request path access sign in.
 *
 * @since 1.0.0
 */
export const requestPathAccessSignIn = /^(\/myhome\/)([0-9.-]+)(\/access\/signin\.jsp)$/;

/**
 * Request path access sign in e xx partner adt.
 *
 * @since 1.0.0
 */
export const requestPathAccessSignInEXxPartnerAdt = /^(\/myhome\/)([0-9.-]+)(\/access\/signin\.jsp\?e=(ns|to)&partner=adt)$/;

/**
 * Request path access sign in network id xx partner adt.
 *
 * @since 1.0.0
 */
export const requestPathAccessSignInNetworkIdXxPartnerAdt = /^(\/myhome\/)([0-9.-]+)(\/access\/signin\.jsp)(\?networkid=[a-z0-9]+)(&partner=adt)$/;

/**
 * Request path ajax sync check serv t xx.
 *
 * @since 1.0.0
 */
export const requestPathAjaxSyncCheckServTXx = /^(\/myhome\/)([0-9.-]+)(\/Ajax\/SyncCheckServ\?t=\d+)$/;

/**
 * Request path keep alive.
 *
 * @since 1.0.0
 */
export const requestPathKeepAlive = /^(\/myhome\/)([0-9.-]+)(\/KeepAlive)$/;

/**
 * Request path mfa mfa sign in workflow challenge.
 *
 * @since 1.0.0
 */
export const requestPathMfaMfaSignInWorkflowChallenge = /^(\/myhome\/)([0-9.-]+)(\/mfa\/mfaSignIn\.jsp\?workflow=challenge)$/;

/**
 * Request path quick control arm disarm.
 *
 * @since 1.0.0
 */
export const requestPathQuickControlArmDisarm = /^(\/myhome\/)([0-9.-]+)(\/quickcontrol\/armDisarm\.jsp)$/;

/**
 * Request path quick control serv run rra command.
 *
 * @since 1.0.0
 */
export const requestPathQuickControlServRunRraCommand = /^(\/myhome\/)([0-9.-]+)(\/quickcontrol\/serv\/RunRRACommand)$/;

/**
 * Request path summary summary.
 *
 * @since 1.0.0
 */
export const requestPathSummarySummary = /^(\/myhome\/)([0-9.-]+)(\/summary\/summary\.jsp)$/;

/**
 * Request path system device id 1.
 *
 * @since 1.0.0
 */
export const requestPathSystemDeviceId1 = /^(\/myhome\/)([0-9.-]+)(\/system\/device\.jsp\?id=1)$/;

/**
 * Request path system gateway.
 *
 * @since 1.0.0
 */
export const requestPathSystemGateway = /^(\/myhome\/)([0-9.-]+)(\/system\/gateway\.jsp)$/;

/**
 * Request path system system.
 *
 * @since 1.0.0
 */
export const requestPathSystemSystem = /^(\/myhome\/)([0-9.-]+)(\/system\/system\.jsp)$/;

/**
 * Text orb sensor zone.
 *
 * @since 1.0.0
 */
export const textOrbSensorZone = /^(Zone )(.*)$/;

/**
 * Text orb text summary sections.
 *
 * @since 1.0.0
 */
export const textOrbTextSummarySections = /\.\s*/;

/**
 * Text panel emergency keys.
 *
 * @since 1.0.0
 */
export const textPanelEmergencyKeys = /([A-Za-z0-9]+: [A-Za-z0-9 ]+? \(Zone \d+\))/g;

/**
 * Text sync code.
 *
 * @since 1.0.0
 */
export const textSyncCode = /^[0-9]+-[0-9]+-[0-9]+$/;

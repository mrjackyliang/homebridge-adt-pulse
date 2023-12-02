/**
 * Arm disarm response path.
 *
 * @since 1.0.0
 */
export const armDisarmResponsePath = /^(\/myhome\/)([0-9.-]+)(\/quickcontrol\/armDisarm\.jsp)$/;

/**
 * Backslash forward slash.
 *
 * @since 1.0.0
 */
export const backslashForwardSlash = /\\\//g;

/**
 * Do submit function.
 *
 * @since 1.0.0
 */
export const doSubmitFunction = /doSubmit\(\s*'([^']+)\?sat=([^']+)&href=([^&]+)(&armstate=([^&]+)&arm=([^']+))?'\s*\)/;

/**
 * Network id param.
 *
 * @since 1.0.0
 */
export const networkIdParam = /[?&]networkid=([^&#']*)/;

/**
 * Gateway response path.
 *
 * @since 1.0.0
 */
export const gatewayResponsePath = /^(\/myhome\/)([0-9.-]+)(\/system\/gateway\.jsp)$/;

/**
 * Homepage response path.
 *
 * @since 1.0.0
 */
export const homepageResponsePath = /^(\/myhome\/)([0-9.-]+)(\/access\/signin\.jsp)$/;

/**
 * Html line break character.
 *
 * @since 1.0.0
 */
export const htmlLineBreakCharacter = /<br( ?\/)?>/;

/**
 * Keep alive response path.
 *
 * @since 1.0.0
 */
export const keepAliveResponsePath = /^(\/myhome\/)([0-9.-]+)(\/KeepAlive)$/;

/**
 * Orb text summary.
 *
 * @since 1.0.0
 */
export const orbTextSummary = /^([A-Za-z0-9 ]+)\. ?([A-Za-z0-9 ]*)\.?$/;

/**
 * Panel information emergency keys.
 *
 * @since 1.0.0
 */
export const panelInformationEmergencyKeys = /([A-Za-z0-9]+: [A-Za-z0-9 ]+? \(Zone \d+\))/g;

/**
 * Panel response path.
 *
 * @since 1.0.0
 */
export const panelResponsePath = /^(\/myhome\/)([0-9.-]+)(\/system\/device\.jsp\?id=1)$/;

/**
 * Run RRA command response path.
 *
 * @since 1.0.0
 */
export const runRRACommandResponsePath = /^(\/myhome\/)([0-9.-]+)(\/quickcontrol\/serv\/RunRRACommand)$/;

/**
 * Sat code param.
 *
 * @since 1.0.0
 */
export const satCodeParam = /sat=([^&']*)/;

/**
 * Set arm state function.
 *
 * @since 1.0.0
 */
export const setArmStateFunction = /setArmState\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'href=([^']+)&armstate=([^&]+)&arm=([^&]+)&sat=([^']+?)'\s*\)/;

/**
 * Sign in mfa response path.
 *
 * @since 1.0.0
 */
export const signInMfaResponsePath = /^(\/myhome\/)([0-9.-]+)(\/mfa\/mfaSignIn\.jsp\?workflow=challenge)$/;

/**
 * Sign in summary response path.
 *
 * @since 1.0.0
 */
export const signInSummaryResponsePath = /^(\/myhome\/)([0-9.-]+)(\/summary\/summary\.jsp)$/;

/**
 * Sign out response path.
 *
 * @since 1.0.0
 */
export const signOutResponsePath = /^(\/myhome\/)([0-9.-]+)(\/access\/signin\.jsp)(\?networkid=[a-z0-9]+)(&partner=adt)$/;

/**
 * Summary refresh response path.
 *
 * @since 1.0.0
 */
export const summaryRefreshResponsePath = /^(\/myhome\/)([0-9.-]+)(\/summary\/summary\.jsp)$/;

/**
 * Sync check serv response path.
 *
 * @since 1.0.0
 */
export const syncCheckServResponsePath = /^(\/myhome\/)([0-9.-]+)(\/Ajax\/SyncCheckServ\?t=\d+)$/;

/**
 * Whitespace characters.
 *
 * @since 1.0.0
 */
export const whitespaceCharacters = /\s+/g;

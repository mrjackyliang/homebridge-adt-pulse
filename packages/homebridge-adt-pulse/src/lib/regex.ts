/**
 * Lib - Regex - Character Backslash Double Quote.
 *
 * Matches escaped double quotes inside serialized error output. Used to swap the
 * escape sequences for single quotes when printing stringified errors to the log.
 *
 * @since 1.0.0
 */
export const characterBackslashDoubleQuote = /\\"/;

/**
 * Lib - Regex - Character Backslash Forward Slash.
 *
 * Matches escaped forward slashes embedded in serialized portal responses. Used to
 * normalize scraped href values back into plain forward slashes before building URLs.
 *
 * @since 1.0.0
 */
export const characterBackslashForwardSlash = /\\\//;

/**
 * Lib - Regex - Character HTML Line Break.
 *
 * Matches an HTML line break tag with or without the self-closing slash. Used to
 * replace break tags with spaces when converting scraped portal markup into text.
 *
 * @since 1.0.0
 */
export const characterHtmlLineBreak = /<br( ?\/)?>/;

/**
 * Lib - Regex - Character Whitespace.
 *
 * Matches runs of consecutive whitespace characters. Used to collapse padding inside
 * text scraped from the portal so values can be compared and displayed consistently.
 *
 * @since 1.0.0
 */
export const characterWhitespace = /\s+/;

/**
 * Lib - Regex - Function Do Submit.
 *
 * Captures the arguments of the inline doSubmit() handler embedded in portal markup.
 * Used to extract the relative URL, sat token, href, and arm state values from buttons.
 *
 * @since 1.0.0
 */
export const functionDoSubmit = /doSubmit\(\s*'([^']+)\?sat=([^']+)&href=([^&]+)(&armstate=([^&]+)&arm=([^']+))?'\s*\)/;

/**
 * Lib - Regex - Function Go To URL.
 *
 * Captures the device id from the inline goToUrl() handler embedded in portal markup.
 * Used to identify which device page a scraped link points to when parsing sensors.
 *
 * @since 1.0.0
 */
export const functionGoToUrl = /^goToUrl\('device\.jsp\?id=([0-9]+)'\);$/;

/**
 * Lib - Regex - Function Set Arm State.
 *
 * Captures the arguments of the inline setArmState() handler embedded in portal markup.
 * Used to extract the URL, button details, arm states, and sat token from orb buttons.
 *
 * @since 1.0.0
 */
export const functionSetArmState = /setArmState\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'href=([^']*)&armstate=([^&]*)&arm=([^&]*)&sat=([^']*?)'\s*\)/;

/**
 * Lib - Regex - Home Kit Accessory Name.
 *
 * Mirrors the name-characteristic rule used by Homebridge's HAP-NodeJS: a
 * Unicode letter or number at both ends and supported characters between.
 *
 * @since 3.5.0
 */
export const homeKitAccessoryName = new RegExp(String.raw`^[\p{L}\p{N}][\p{L}\p{N}\p{Zs}\u2019'&!._:;()/,-]*[\p{L}\p{N}]$`, 'u');

/**
 * Lib - Regex - Object Key Client Type.
 *
 * Captures the xClientType value from the inline JavaScript object in portal markup.
 * Used to replay multi-factor authentication requests with the original client type.
 *
 * @since 1.0.0
 */
export const objectKeyClientType = /xClientType: ['"](.+)['"],/;

/**
 * Lib - Regex - Object Key Locale.
 *
 * Captures the locale value from the inline JavaScript object in portal markup.
 * Used to replay multi-factor authentication requests with the original locale.
 *
 * @since 1.0.0
 */
export const objectKeyLocale = /locale: ['"](.+)['"],/;

/**
 * Lib - Regex - Object Key Login.
 *
 * Captures the xLogin value from the inline JavaScript object in portal markup.
 * Used to replay multi-factor authentication requests with the original login name.
 *
 * @since 1.0.0
 */
export const objectKeyLogin = /xLogin: ['"](.+)['"],/;

/**
 * Lib - Regex - Object Key Pre Auth Token.
 *
 * Captures the xPreAuthToken value from the inline JavaScript object in portal markup.
 * Used to replay multi-factor authentication requests with the original pre-auth token.
 *
 * @since 1.0.0
 */
export const objectKeyPreAuthToken = /xPreAuthToken: ['"](.+)['"],/;

/**
 * Lib - Regex - Object Key Sat.
 *
 * Captures the sat value from the inline JavaScript object in portal markup. Used to
 * obtain the session access token that must accompany portal form submissions.
 *
 * @since 1.0.0
 */
export const objectKeySat = /sat: ['"](.+)['"],/;

/**
 * Lib - Regex - Param Network ID.
 *
 * Captures the networkid value from a portal URL query string. Used to carry the
 * network identifier forward when following redirects during the sign-in flow.
 *
 * @since 1.0.0
 */
export const paramNetworkId = /[?&]networkid=([^&#']*)/;

/**
 * Lib - Regex - Param Sat.
 *
 * Captures the sat value from a portal URL query string. Used to obtain the session
 * access token that must accompany subsequent portal requests after signing in.
 *
 * @since 1.0.0
 */
export const paramSat = /sat=([^&']*)/;

/**
 * Lib - Regex - Request Path Access Sign In.
 *
 * Matches the versioned portal path for the sign-in page and captures the portal
 * version. Used to validate responses and to detect when a session gets logged out.
 *
 * @since 1.0.0
 */
export const requestPathAccessSignIn = /^(\/myhome\/)([0-9.-]+)(\/access\/signin\.jsp)$/;

/**
 * Lib - Regex - Request Path Access Sign In E Xx Partner Adt.
 *
 * Matches the versioned portal path for the sign-in page with an error code and the
 * ADT partner parameter. Used to detect log outs caused by errors or session timeouts.
 *
 * @since 1.0.0
 */
export const requestPathAccessSignInEXxPartnerAdt = /^(\/myhome\/)([0-9.-]+)(\/access\/signin\.jsp\?e=(ns|to|un)&partner=adt)$/;

/**
 * Lib - Regex - Request Path Access Sign In Network ID Xx Partner Adt.
 *
 * Matches the versioned portal path for the sign-in page with a network id and the
 * ADT partner parameter. Used to confirm that a sign-out request completed correctly.
 *
 * @since 1.0.0
 */
export const requestPathAccessSignInNetworkIdXxPartnerAdt = /^(\/myhome\/)([0-9.-]+)(\/access\/signin\.jsp)(\?networkid=[a-z0-9]+)(&partner=adt)$/;

/**
 * Lib - Regex - Request Path Ajax Sync Check Serv T Xx.
 *
 * Matches the versioned portal path for the sync check endpoint with its timestamp.
 * Used to confirm that a sync check response came from the expected portal endpoint.
 *
 * @since 1.0.0
 */
export const requestPathAjaxSyncCheckServTXx = /^(\/myhome\/)([0-9.-]+)(\/Ajax\/SyncCheckServ\?t=\d+)$/;

/**
 * Lib - Regex - Request Path Keep Alive.
 *
 * Matches the versioned portal path for the keep alive endpoint. Used to confirm
 * that a session refresh request landed on the expected portal endpoint.
 *
 * @since 1.0.0
 */
export const requestPathKeepAlive = /^(\/myhome\/)([0-9.-]+)(\/KeepAlive)$/;

/**
 * Lib - Regex - Request Path Mfa Mfa Sign In Workflow Challenge.
 *
 * Matches the versioned portal path for the multi-factor sign-in challenge page.
 * Used to detect when the portal requires a verification step during login.
 *
 * @since 1.0.0
 */
export const requestPathMfaMfaSignInWorkflowChallenge = /^(\/myhome\/)([0-9.-]+)(\/mfa\/mfaSignIn\.jsp\?workflow=challenge)$/;

/**
 * Lib - Regex - Request Path Nga Serv Run Rra Proxy Href Rest Adt UI Client Multi Factor Auth Add Trusted Device Sat Xx.
 *
 * Matches the versioned portal path for the proxy call that adds a trusted device.
 * Used to confirm that a trust device request landed on the expected portal endpoint.
 *
 * @since 1.0.0
 */
export const requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthAddTrustedDeviceSatXx = /^(\/myhome\/)([0-9.-]+)(\/nga\/serv\/RunRRAProxy\?href=rest\/adt\/ui\/client\/multiFactorAuth\/addTrustedDevice&sat=(.+))$/;

/**
 * Lib - Regex - Request Path Nga Serv Run Rra Proxy Href Rest Adt UI Client Multi Factor Auth Request Otp For Registered Property Sat Xx.
 *
 * Matches the versioned portal path for the proxy call that requests a one-time
 * passcode. Used to confirm that an OTP request landed on the expected portal endpoint.
 *
 * @since 1.0.0
 */
export const requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthRequestOtpForRegisteredPropertySatXx = /^(\/myhome\/)([0-9.-]+)(\/nga\/serv\/RunRRAProxy\?href=rest\/adt\/ui\/client\/multiFactorAuth\/requestOtpForRegisteredProperty&sat=(.+))$/;

/**
 * Lib - Regex - Request Path Nga Serv Run Rra Proxy Href Rest Adt UI Client Multi Factor Auth Validate Otp Sat Xx.
 *
 * Matches the versioned portal path for the proxy call that validates a one-time
 * passcode. Used to confirm that an OTP check landed on the expected portal endpoint.
 *
 * @since 1.0.0
 */
export const requestPathNgaServRunRraProxyHrefRestAdtUiClientMultiFactorAuthValidateOtpSatXx = /^(\/myhome\/)([0-9.-]+)(\/nga\/serv\/RunRRAProxy\?href=rest\/adt\/ui\/client\/multiFactorAuth\/validateOtp&sat=(.+))$/;

/**
 * Lib - Regex - Request Path Nga Serv Run Rra Proxy Href Rest Icontrol UI Client Multi Factor Auth Sat Xx.
 *
 * Matches the versioned portal path for the proxy call that fetches multi-factor
 * authentication settings. Used to confirm the request landed on the expected endpoint.
 *
 * @since 1.0.0
 */
export const requestPathNgaServRunRraProxyHrefRestIcontrolUiClientMultiFactorAuthSatXx = /^(\/myhome\/)([0-9.-]+)(\/nga\/serv\/RunRRAProxy\?href=rest\/icontrol\/ui\/client\/multiFactorAuth&sat=(.+))$/;

/**
 * Lib - Regex - Request Path Nga Serv Run Rra Proxy Only Client Multi Factor Auth Exclude Sat Xx Href Rest Adt UI Updates Sat Xx.
 *
 * Matches the versioned portal path for the proxy call that polls multi-factor
 * authentication updates. Used to confirm the poll landed on the expected endpoint.
 *
 * @since 1.0.0
 */
export const requestPathNgaServRunRraProxyOnlyClientMultiFactorAuthExcludeSatXxHrefRestAdtUiUpdatesSatXx = /^(\/myhome\/)([0-9.-]+)(\/nga\/serv\/RunRRAProxy\?only=client.multiFactorAuth&exclude=&sat=(.+)&href=rest\/adt\/ui\/updates&sat=(.+)&)$/;

/**
 * Lib - Regex - Request Path Quick Control Arm Disarm.
 *
 * Matches the versioned portal path for the arm and disarm page. Used to confirm
 * that an arm mode change request landed on the expected portal endpoint.
 *
 * @since 1.0.0
 */
export const requestPathQuickControlArmDisarm = /^(\/myhome\/)([0-9.-]+)(\/quickcontrol\/armDisarm\.jsp)$/;

/**
 * Lib - Regex - Request Path Quick Control Serv Run Rra Command.
 *
 * Matches the versioned portal path for the arm and disarm command endpoint. Used
 * to confirm that a force arm request landed on the expected portal endpoint.
 *
 * @since 1.0.0
 */
export const requestPathQuickControlServRunRraCommand = /^(\/myhome\/)([0-9.-]+)(\/quickcontrol\/serv\/RunRRACommand)$/;

/**
 * Lib - Regex - Request Path Summary Summary.
 *
 * Matches the versioned portal path for the summary page. Used to confirm that a
 * login or summary request landed on the expected portal endpoint.
 *
 * @since 1.0.0
 */
export const requestPathSummarySummary = /^(\/myhome\/)([0-9.-]+)(\/summary\/summary\.jsp)$/;

/**
 * Lib - Regex - Request Path System Device Id1.
 *
 * Matches the versioned portal path for the device page of the security panel. Used
 * to confirm that a panel information request landed on the expected portal endpoint.
 *
 * @since 1.0.0
 */
export const requestPathSystemDeviceId1 = /^(\/myhome\/)([0-9.-]+)(\/system\/device\.jsp\?id=1)$/;

/**
 * Lib - Regex - Request Path System Gateway.
 *
 * Matches the versioned portal path for the gateway page. Used to confirm that a
 * gateway information request landed on the expected portal endpoint.
 *
 * @since 1.0.0
 */
export const requestPathSystemGateway = /^(\/myhome\/)([0-9.-]+)(\/system\/gateway\.jsp)$/;

/**
 * Lib - Regex - Request Path System System.
 *
 * Matches the versioned portal path for the system page. Used to confirm that a
 * device listing request landed on the expected portal endpoint.
 *
 * @since 1.0.0
 */
export const requestPathSystemSystem = /^(\/myhome\/)([0-9.-]+)(\/system\/system\.jsp)$/;

/**
 * Lib - Regex - Text One Time Passcode.
 *
 * Matches a six digit one-time passcode. Used to validate user supplied verification
 * codes before they are submitted to the portal during multi-factor authentication.
 *
 * @since 1.0.0
 */
export const textOneTimePasscode = /^[0-9]{6}$/;

/**
 * Lib - Regex - Text Orb Sensor Zone.
 *
 * Captures the zone number portion of a sensor zone label shown on the summary orb.
 * Used to link scraped sensor entries back to the zones configured on the panel.
 *
 * @since 1.0.0
 */
export const textOrbSensorZone = /^(Zone )(.*)$/;

/**
 * Lib - Regex - Text Orb Text Summary Sections.
 *
 * Matches the period and trailing whitespace separating orb text summary sections.
 * Used to split the panel status sentence into its individual status fragments.
 *
 * @since 1.0.0
 */
export const textOrbTextSummarySections = /\.\s*/;

/**
 * Lib - Regex - Text Sensor Trailing Numbered Parentheses.
 *
 * Matches a portal sensor name ending in a numbered parenthetical suffix. Used
 * to make the fallback HomeKit display name end with a valid character.
 *
 * @since 3.5.0
 */
export const textSensorTrailingNumberedParentheses = / \((\d+)\)$/;

/**
 * Lib - Regex - Text Panel Emergency Keys.
 *
 * Matches emergency key descriptions in the name, type, and zone number format.
 * Used to extract the emergency key entries when parsing panel information.
 *
 * @since 1.0.0
 */
export const textPanelEmergencyKeys = /([A-Za-z0-9]+: [A-Za-z0-9 ]+? \(Zone \d+\))/;

/**
 * Lib - Regex - Text Panel Type Model.
 *
 * Captures the type and model portions of the panel description shown on the portal.
 * Used to split the combined string into separate values for accessory metadata.
 *
 * @since 1.0.0
 */
export const textPanelTypeModel = /(.+) - (.+)/;

/**
 * Lib - Regex - Text Sync Code.
 *
 * Matches the dash separated numeric format of a portal sync code. Used to validate
 * sync check responses before they are compared against previously known values.
 *
 * @since 1.0.0
 */
export const textSyncCode = /^[0-9]+-[0-9]+-[0-9]+$/;

/**
 * Lib - Regex - Browser Version.
 *
 * Accepts the numeric versions published by the supported stable-release feeds.
 * A release with letters or extra segments is not a supported Stable build.
 *
 * @since 3.5.0
 */
export const browserVersion = /^[0-9]+(?:\.[0-9]+){0,3}$/;

/**
 * Lib - Regex - Opera Stable Title.
 *
 * Reads the stable major or full version from an Opera Desktop RSS item title.
 * Non-stable post titles do not match.
 *
 * @since 3.5.0
 */
export const operaStableTitle = /^Opera ([0-9]+(?:\.[0-9]+){0,3}) Stable/;

/**
 * Lib - Regex - Opera Chromium Version.
 *
 * Reads the Chromium build announced in an Opera Desktop stable release post.
 * This keeps the Chrome and OPR user-agent tokens in a compatible pair.
 *
 * @since 3.5.0
 */
export const operaChromiumVersion = /Chromium ([0-9]+(?:\.[0-9]+){1,3})/;

/**
 * Lib - Regex - Opera Archive Version.
 *
 * Reads full desktop versions from Opera's official release archive links.
 * Versions from other directories are ignored.
 *
 * @since 3.5.0
 */
export const operaArchiveVersion = /^([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)\/$/;

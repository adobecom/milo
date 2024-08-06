const authoringPath = new URLSearchParams(window.location.search).get("authoringpath") || "/federal/dev";
const env = new URLSearchParams(window.location.search).get("env") || "stage";
const privacyId = new URLSearchParams(window.location.search).get("privacyid");
const locale = new URLSearchParams(window.location.search).get("locale");
const navBranch = new URLSearchParams(window.location.search).get("navbranch") || "gnav";
const unavComponents = new URLSearchParams(window.location.search).get("unav") || "appswitcher,profile,notifications";
const imsClientId = new URLSearchParams(window.location.search).get("imsclientid") || "adobedotcom-cc";
const redirect = new URLSearchParams(window.location.search).get("redirect") || "off";

async function init() {
  const { default: loadBlock } = await import(`https://${navBranch}--milo--adobecom.hlx.page/libs/navigation/navigation.js`);
  loadBlock({
    env,
    locale,
    authoringPath,
    footer: { authoringPath, privacyId },
    header: { imsClientId, unavComponents, redirect },
  });
}
init();
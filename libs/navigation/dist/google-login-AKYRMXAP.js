import "./chunk-NE6SFPCS.js";

// ../features/google-login.js
var GOOGLE_SCRIPT = "https://accounts.google.com/gsi/client";
var GOOGLE_ID = "530526366930-l874a90ipfkn26naa71r010u8epp39jt.apps.googleusercontent.com";
var PLACEHOLDER = "feds-googleLogin";
var WRAPPER = "feds-profile";
var onToken = async (getMetadata, data, getConfig) => {
  let destination;
  const config = getConfig();
  try {
    destination = new URL(typeof config.googleLoginURLCallback === "function" ? await config.googleLoginURLCallback() : getMetadata("google-login-redirect"))?.href;
  } catch {
  }
  await window.adobeIMS.socialHeadlessSignIn({
    provider_id: "google",
    idp_token: data?.credential,
    client_id: window.adobeid?.client_id,
    scope: window.adobeid?.scope
  }).then(() => {
    if (window.DISABLE_PAGE_RELOAD === true) return;
    if (destination) {
      window.location.assign(destination);
    } else {
      window.location.reload();
    }
  }).catch(() => {
    window.adobeIMS.signInWithSocialProvider("google", { redirect_uri: destination || window.location.href });
  });
};
async function initGoogleLogin(loadIms, getMetadata, loadScript, getConfig) {
  try {
    await loadIms();
  } catch {
    return;
  }
  if (window.adobeIMS?.isSignedInUser()) return;
  await loadScript(GOOGLE_SCRIPT);
  const placeholder = document.createElement("div");
  placeholder.id = PLACEHOLDER;
  document.querySelector(`.${WRAPPER}`)?.append(placeholder);
  window.google?.accounts?.id?.initialize({
    client_id: GOOGLE_ID,
    callback: (data) => onToken(getMetadata, data, getConfig),
    prompt_parent_id: PLACEHOLDER,
    cancel_on_tap_outside: false
  });
  window.google?.accounts?.id?.prompt();
}
export {
  initGoogleLogin as default
};
//# sourceMappingURL=google-login-AKYRMXAP.js.map

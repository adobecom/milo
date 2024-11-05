import {
  getConfig,
  getMetadata
} from "./chunk-G4SXHKM5.js";
import "./chunk-NE6SFPCS.js";

// ../features/personalization/promo-utils.js
var GMTStringToLocalDate = (gmtString) => /* @__PURE__ */ new Date(`${gmtString}+00:00`);
var APAC = ["au", "cn", "hk_en", "hk_zh", "id_en", "id_id", "in", "in_hi", "kr", "my_en", "my_ms", "nz", "ph_en", "ph_fil", "sg", "th_en", "th_th", "tw", "vn_en", "vn_vi"];
var EMEA = ["ae_en", "ae_ar", "africa", "at", "be_en", "be_fr", "be_nl", "bg", "ch_de", "ch_fr", "ch_it", "cis_en", "cis_ru", "cz", "de", "dk", "ee", "eg_ar", "eg_en", "es", "fi", "fr", "gr_el", "gr_en", "hu", "ie", "il_en", "il_he", "iq", "is", "it", "kw_ar", "kw_en", "lt", "lu_de", "lu_en", "lu_fr", "lv", "mena_ar", "mena_en", "ng", "nl", "no", "pl", "pt", "qa_ar", "qa_en", "ro", "ru", "sa_en", "sa_ar", "se", "si", "sk", "tr", "ua", "uk", "za"];
var AMERICAS = ["us", "ar", "br", "ca", "ca_fr", "cl", "co", "cr", "ec", "gt", "la", "mx", "pe", "pr"];
var JP = ["jp"];
var REGIONS = { APAC, EMEA, AMERICAS, JP };
var localeCode = getConfig()?.locale?.prefix?.substring(1) || "us";
var regionCode = Object.keys(REGIONS).find((r) => REGIONS[r]?.includes(localeCode))?.toLowerCase() || null;
var isDisabled = (event, searchParams) => {
  if (!event) return false;
  if (event.locales && !event.locales.includes(localeCode)) return true;
  const currentDate = searchParams?.get("instant") ? new Date(searchParams.get("instant")) : /* @__PURE__ */ new Date();
  if (!event.start && event.end || !event.end && event.start) return true;
  return Boolean(event.start && event.end && (currentDate < event.start || currentDate > event.end));
};
var isManifestWithinLocale = (locales) => {
  if (!locales) return true;
  return locales.split(";").map((locale) => locale.trim()).includes(localeCode);
};
var getRegionalPromoManifests = (manifestNames, region, searchParams) => {
  const attachedManifests = manifestNames ? manifestNames.split(",")?.map((manifest) => manifest?.trim()) : [];
  const schedule = getMetadata(region ? `${region}_schedule` : "schedule");
  if (!schedule) {
    return [];
  }
  return schedule.split(",").map((manifest) => {
    const [name, start, end, manifestPath, locales] = manifest.trim().split("|").map((s) => s.trim());
    if (attachedManifests.includes(name) && isManifestWithinLocale(locales)) {
      const event = {
        name,
        start: GMTStringToLocalDate(start),
        end: GMTStringToLocalDate(end)
      };
      const disabled = isDisabled(event, searchParams);
      return { manifestPath, disabled, event };
    }
    return null;
  }).filter((manifest) => manifest != null);
};
function getPromoManifests(manifestNames, searchParams) {
  const promoManifests = regionCode != null ? getRegionalPromoManifests(
    manifestNames[`${regionCode}_manifestnames`],
    regionCode,
    searchParams
  ) : [];
  const globalPromoManifests = getRegionalPromoManifests(
    manifestNames.manifestnames,
    null,
    searchParams
  );
  return [...promoManifests, ...globalPromoManifests];
}
export {
  getPromoManifests as default,
  isDisabled
};
//# sourceMappingURL=promo-utils-TBPN5XQU.js.map

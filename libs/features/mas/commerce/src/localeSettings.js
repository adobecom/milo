import { Defaults } from './defaults.js';

const DEFAULT_LOCALE = `${Defaults.language}_${Defaults.country}`;

const MiloMap = {
    ar: 'AR_es',
    be_en: 'BE_en',
    be_fr: 'BE_fr',
    be_nl: 'BE_nl',
    br: 'BR_pt',
    ca: 'CA_en',
    ch_de: 'CH_de',
    ch_fr: 'CH_fr',
    ch_it: 'CH_it',
    cl: 'CL_es',
    co: 'CO_es',
    la: 'DO_es',
    mx: 'MX_es',
    pe: 'PE_es',
    africa: 'MU_en',
    dk: 'DK_da',
    de: 'DE_de',
    ee: 'EE_et',
    eg_ar: 'EG_ar',
    eg_en: 'EG_en',
    es: 'ES_es',
    fr: 'FR_fr',
    gr_el: 'GR_el',
    gr_en: 'GR_en',
    ie: 'IE_en',
    il_he: 'IL_iw',
    it: 'IT_it',
    lv: 'LV_lv',
    lt: 'LT_lt',
    lu_de: 'LU_de',
    lu_en: 'LU_en',
    lu_fr: 'LU_fr',
    my_en: 'MY_en',
    my_ms: 'MY_ms',
    hu: 'HU_hu',
    mt: 'MT_en',
    mena_en: 'DZ_en',
    mena_ar: 'DZ_ar',
    nl: 'NL_nl',
    no: 'NO_nb',
    pl: 'PL_pl',
    pt: 'PT_pt',
    ro: 'RO_ro',
    si: 'SI_sl',
    sk: 'SK_sk',
    fi: 'FI_fi',
    se: 'SE_sv',
    tr: 'TR_tr',
    uk: 'GB_en',
    at: 'AT_de',
    cz: 'CZ_cs',
    bg: 'BG_bg',
    ru: 'RU_ru',
    ua: 'UA_uk',
    au: 'AU_en',
    in_en: 'IN_en',
    in_hi: 'IN_hi',
    id_en: 'ID_en',
    id_id: 'ID_in',
    nz: 'NZ_en',
    sa_ar: 'SA_ar',
    sa_en: 'SA_en',
    sg: 'SG_en',
    cn: 'CN_zh-Hans',
    tw: 'TW_zh-Hant',
    hk_zh: 'HK_zh-hant',
    jp: 'JP_ja',
    kr: 'KR_ko',
    za: 'ZA_en',
    ng: 'NG_en',
    cr: 'CR_es',
    ec: 'EC_es',
    pr: 'US_es', // not a typo, should be US
    gt: 'GT_es',
    cis_en: 'AZ_en',
    cis_ru: 'AZ_ru',
    sea: 'SG_en',
    th_en: 'TH_en',
    th_th: 'TH_th',
};

function getMiloLocaleSettings(locale) {
  const geo = locale.prefix.replace('/', '') ?? '';
  let [country = Defaults.country, language = Defaults.language] = (
      MiloMap[geo] ?? geo
  ).split('_', 2);

  country = country.toUpperCase();
  language = language.toLowerCase();

  return {
      country,
      language,
      locale: `${language}_${country}`,
  };
}

function getLocaleSettings({ locale, country, language }) {
  if (locale?.prefix) return getMiloLocaleSettings(locale);
  if (typeof(locale) === 'object') locale = null;
  locale ??= DEFAULT_LOCALE;
  language ??= locale.split('_')?.[0] || Defaults.language;
  country ??= locale.split('_')?.[1] || Defaults.country;
  return { locale, country, language };
}

export { getLocaleSettings, MiloMap as GeoMap };

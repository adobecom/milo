
//Language events[0].data._adobe_corpnew.digitalData.page.pageInfo.language
//digitalData.page.pageInfo.language

var w = window,
  _sat = _satellite,

// Execute this If block only it it is a Milo page & locale property existing (allow the empty string for US)
if(locale !== undefined && locale !== null){

  var langCode  = w.alloy_all.get('data._adobe_corpnew.digitalData.page.pageInfo.language.langCode'),
      langValue = _sat.getVar('languageMapper', { loc : locale }) || '';
  
  // check if the languageMapper return the lang value
  if(langValue && typeof langValue === 'string') {
    return langValue;
  }
  // else pass the langCode property
  else if(langCode && typeof langCode === 'string') {
    return langCode;
  } 
  // else return the default en-US value
  else {
    return 'en-US';
  }
  
}


const locales = {
  
  //Americas
  '': 'en-US',
  ar: 'es-AR', 
  br: 'pt-BR', 
  ca: 'en-CA', 
  ca_fr: 'fr-CA', 
  cl: 'es-CL', 
  co: 'es-CO', 
  la: 'es-LA', 
  mx: 'es-MX', 
  pe: 'es-PE',

  //EMEA
  africa: 'en-AFRICA', 
  be_fr: 'fr-BE', 
  be_en: 'en-BE', 
  be_nl: 'nl-BE', 
  cy_en: 'en-CY', 
  dk: 'da-DK', 
  de: 'de-DE', 
  ee: 'et-EE', 
  es: 'es-ES', 
  fr: 'fr-FR', 
  gr_en: 'en-GR', 
  ie: 'en-IE', //
  il_en: 'en-IL', 
  it: 'it-IT', 
  lv: 'lv-LV', 
  lt: 'lt-LT', 
  lu_de: 'de-LU', 
  lu_en: 'en-LU', 
  lu_fr: 'fr-LU', 
  hu: 'hu-HU', 
  mt: 'en-MT', 
  mena_en: 'en-MENA', 
  nl: 'nl-NL', 
  no: 'no-NO', 
  pl: 'pl-PL', 
  pt: 'pt-PT', 
  ro: 'ro-RO', 
  sa_en: 'en-SA', 
  ch_de: 'de-CH', 
  si: 'sl-SI', 
  sk: 'sk-SK', 
  ch_fr: 'fr-CH', 
  fi: 'fi-FI', 
  se: 'sv-SE',
  ch_it: 'it-CH', 
  tr: 'tr-TR', 
  ae_en: 'en-AE', 
  uk: 'en-UK', 
  at: 'de-AT', 
  cz: 'cs-CZ', 
  bg: 'bg-BG', 
  ru: 'ru-RU', 
  ua: 'uk-UA', 
  il_he: 'iw-IL', 
  ae_ar: 'ar-AE', 
  mena_ar: 'ar-MENA', 
  sa_ar: 'ar-SA', 

  //Asia Pacific
  au: 'en-AU', 
  hk_en: 'en-HK', 
  in: 'en-IN', 
  id_id: 'in-ID', 
  id_en: 'en-ID', 
  my_ms: 'ms-MY', 
  my_en: 'en-MY', 
  nz: 'en-NZ', 
  ph_en: 'en-PH', 
  ph_fil: 'fil-PH', 
  sg: 'en-SG', 
  th_en: 'en-TH', 
  in_hi: 'hi-IN', 
  th_th: 'th-TH', 
  cn: 'zh-CN', 
  hk_zh: 'zh-HK', 
  tw: 'zh-hant-TW', 
  jp: 'ja-JP', 
  kr: 'ko-KR', 
  
  //Langstore Support.
  langstore: 'en-US', 

  //GEO Expansion MWPW-125686
  za: 'en-ZA',  // South Africa (GB English)
  ng: 'en-NG',  // Nigeria (GB English)
  cr: 'es-CR',  // Costa Rica (Spanish Latin America)
  ec: 'es-EC',  // Ecuador (Spanish Latin America)
  pr: 'es-PR',  // Puerto Rico (Spanish Latin America)
  gt: 'es-GT',  // Guatemala (Spanish Latin America)
  eg_ar: 'ar-EG',  // Egypt (Arabic)
  kw_ar: 'ar-KW',  // Kuwait (Arabic)
  qa_ar: 'ar-QA',  // Qatar (Arabic)
  eg_en: 'en-EG',  // Egypt (GB English)
  kw_en: 'en-KW',  // Kuwait (GB English)
  qa_en: 'en-QA',  // Qatar (GB English)
  gr_el: 'el-GR',  // Greece (Greek)
  vn_en: 'en-VN', 
  vn_vi: 'vi-VN', 
  cis_ru: 'ru-CIS', 
  cis_en: 'en-CIS'

};

var loc = event.loc;
var lang = (loc) ? locales[loc] : '';

return lang;
//PageName event.data._adobe_corpnew.digitalData.page.pageInfo.pageName


var 
  w = window,
  _satellite = w._satellite,
  urlRegions = _satellite.getVar('adobe_urlRegions'),

  name = 'adobe_pageNameLogic',
  pageNameLogic,
  DE;

// Data Elements Cache
DE = _satellite.DE = _satellite.DE || {};

if ((
  pageNameLogic = DE[name]
)) {
  return pageNameLogic;
}

DE[name] = pageNameLogic = function (loc) {
  // default it to something if it is empty
  loc = loc || window.location;

  var
    pageName,

    // hostname = loc.hostname,
    hostnameTemp = loc.hostname,

    // pathname = loc.pathname,
    pathnameTemp = loc.pathname,
    pathnameSegment,
    pathnameSegments,
    pathnameTempArray = [],

    fileExtensions = [
      '.aspx',
      '.php',
      '.html',
    ],
    i, il;

  //----------------------------------------------------------------------------
  // Hostname
  //----------------------------------------------------------------------------
  // replace www. in the hostname
  hostnameTemp = hostnameTemp.replace('www.', '');

  //----------------------------------------------------------------------------
  // Pathname
  //----------------------------------------------------------------------------
  // replace common file extensions
  for (i = 0, il = fileExtensions.length; i < il; i++) {
    // TODO: Is there danger in replacing extension names in the middle of the
    // pathname?
    pathnameTemp = pathnameTemp.replace(fileExtensions[i], '');
  }

  // remove all empty strings from pathname
  // (i.e. ...adobe.com//products//photoshop.html/ has 4 empty strings in the 
  // pathname)

  // get each individual segment of the path
  pathnameSegments = pathnameTemp.split('/');

  for (i = 0, il = pathnameSegments.length; i < il; i++) {
    pathnameSegment = pathnameSegments[i];
    if (
      // remove all empty strings from pathname
      // (i.e. ...adobe.com//products//photoshop.html/ has 4 empty strings in the 
      // pathname)
      pathnameSegment !== '' && 
      // remove region from path
      !urlRegions[pathnameSegment.toLowerCase()]
    ) {
      pathnameTempArray.push(pathnameSegment);
    }
  }

  // join the path together with colons
  pathnameTemp = pathnameTempArray.join(':');

  //--------------------------------------------------------------------------
  // All together now
  //--------------------------------------------------------------------------
  pageName = hostnameTemp + (pathnameTemp ? (':' + pathnameTemp) : '');

  return pageName;
};

return pageNameLogic;


//processedPageName event.data._adobe_corpnew.digitalData.page.pageInfo.processedPageName

// global digitalData:true
var
  processPagenameLogic;

processPagenameLogic = function (l) {
  l = l.toLowerCase();
  var processedpage = l,
  arrayFilter,
  pagearray = l.split(':'),
  lightroomfilter =['lightroom.adobe.com','embed','shares','libraries','gallery','learn','tutorial','discover','remix','api','feedback','lrdesktop','albums','shared-with-you','search','gallery','incomplete','assets','u','slideshow'],
  stockfilter = ['stock.adobe.com','3d-assets','aaid','category','collections','contributor','download','downloadfiledirectly','id','images','Library','pages','sc','search','stock-photo','templates','urn','video','editorial','free','audio','premium','login','generate','artisthub'],
  xdfilter = ['xd.adobe.com','embed','grid','screen','specs','view','spec'],
  expressfilter = ['express.adobe.com','aaid','accept-invite','branding','design','design-remix','folders','libraries','manage-access','page','post','remix','sc','sp','urn','video','new','projects','app-licensing','app-licensing-homepage'],
  accountfilter = ['accounts.adobe.com','account.adobe.com','30_free_days','60_free_days','90_free_days','agent_chat','cancel-plan','change-plan','change reason selected modal','complete','cs_help','edit-payment','modal','new-change-plan-offers-loaded','no_offershown','offer_search','plans','promotion','review','save_offer','switch','temp_license_prod','billing-history','cancel-reason','change reason selected modal','cs_help','details','manage plan modal','modal','offer_search','orders','other','plan-benefits-modal','plan-details','returns','save_offer','downloads'],
  adminconsolefilter = ['adminconsole.adobe.com','account','administrators','add-products','all-packages','billing-history','contract','contracts-and-agreements','enterprise','identity','packages','products','profile','profiles','overview','quick-assign-products','renew-products','requests','review-user-introductions','settings','storage','support','user-management','users','version.xml','all-users','directories','summary','user-groups'],
  communityfilter = ['community.adobe.com','account-payment-plan-discussions','acrobat-discussions','acrobat-reader-discussions','acrobat-reader-mobile-discussions','acrobat-sdk-discussions','acrobat-services-api-discussions',
  'adobe-acrobat-online-discussions','adobe-acrobat-sign-discussions','adobe-aero-bugs','adobe-aero-discussions','adobe-color-discussions','adobe-express-bugs','adobe-express-discussions','adobe-firefly-bugs',
  'adobe-firefly-discussions','adobe-firefly-ideas','adobe-fonts-discussions','adobe-learning-manager-discussions','adobe-media-encoder-discussions','adobe-scan-discussions','adobe-xd-discussions','after-effects-beta-discussions',
  'after-effects-bugs','after-effects-discussions','after-effects-ideas','air-discussions','animate-discussions','audition-discussions','badges','bridge-discussions','business-catalyst-discussions-read-only','camera-raw-discussions','captivate-discussions','character-animator-discussions','coldfusion-discussions','color-management-discussions','connect-discussions','contentarchivals','creative-cloud-desktop-discussions','creative-cloud-services-discussions','digital-editions-discussions','dimension-discussions','download-install-discussions','dreamweaver-discussions','enterprise-teams-discussions','exchange-discussions','fireworks-discussions','flash-player-discussions','forums','framemaker-discussions','fresco-discussions','illustrator-discussions','illustrator-draw-discussions','illustrator-on-the-ipad-discussions','incopy-discussions','indesign-discussions','kudos','lightroom-classic-bugs','lightroom-classic-discussions','lightroom-classic-ideas','lightroom-ecosystem-cloud-based-bugs','lightroom-ecosystem-cloud-based-discussions','lightroom-ecosystem-cloud-based-ideas','mixamo-discussions','muse-discussions','photoshop-beta-bugs','photoshop-beta-discussions','photoshop-discussions','photoshop-ecosystem-bugs','photoshop-ecosystem-discussions','photoshop-ecosystem-ideas','photoshop-elements-discussions','photoshop-express-discussions','photoshop-sketch-discussions','postscript-discussions','premiere-elements-discussions','premiere-pro-beta-bugs','premiere-pro-beta-discussions','premiere-pro-bugs','premiere-pro-discussions','premiere-pro-ideas','premiere-rush-discussions','robohelp-discussions','stock-contributors-discussions','stock-discussions','substance-3d-designer-discussions','substance-3d-painter-bugs','substance-3d-painter-discussions','substance-3d-plugins-discussions','substance-3d-sampler-discussions','substance-3d-stager-discussions','t5','team-projects-discussions','the-lounge-discussions','type-typography-discussions','user','using-the-community-discussions','video','video-hardware-discussions','video-lounge-discussions','xd-discussions'],
  acrobatfilter = ['acrobat.adobe.com','aaid','documents','gdrive','id','link','onedrive','sc','urn'],
  behancefilter = ['behance.net','appreciated','collection','collections','dailycc','discover','drafts','editor','followers','following','font','gallery','inbox','info','insights','joblist','live','loggedout','moodboard','profile','projects','report','resume','search','talent'],
  fontsfilter = ['fonts.adobe.com','confirm','fonts','results','select','upload','vs'],
  photoshopfilter = ['photoshop.adobe.com','id','urn','aaid','sc','us','ap','eu','va6c2','va7'],
  planfilter = ['plan.adobe.com','cancel','cancel-reason','change','entitlements','interest','learn-more','loss-aversion-page','offers','offers-loaded','quiz','reasons','review','select-licenses','switch','switch-plan','view','plans','view-offer-details','saved','results'],
  colorfilter = ['color.adobe.com', 'cloud','color','color-accessibility','color-contrast-analyzer','color-wheel','color-wheel-game','image','image-gradient','mythemes','urn','aaid','sc','library','trends','create'],
  creativefilter = ['creative.adobe.com', 'code','redeem','share'],
  portfoliofilter = ['portfolio.adobe.com','account-swaps','admin','preview','editor','firsteditor','switch-theme','user'],
  schedulefilter = ['schedule.adobe.com', 'calendar','connect','finalise'],
  newexpressfilter = ['new.express.adobe.com','aaid','branding','brands','design','design-remix','id','libraries','link','page','post','sc','sp','template','urn','video','webpage','your-stuff']; 


  arrayFilter = function (pagearray, filterarray){
    return pagearray.filter(function(value){return filterarray.includes(value);}).join(':');
  }

  //check for echosign, adobesign or documents.adobe.com and sets to that subdomain if any value exists.
  l.match('.*\.echosign\..*|.*\.adobesign\..*|.*documents\.adobe\.com.*') ?
    processedpage = l.match('(.*\.echosign\.[^\:]*|.*\.adobesign\.[^\:]*|.*documents\.adobe\.com[^\:]*).*')[1]	:
    //checks for a pagename value
      //Lightroom Site logic
      l.match('^lightroom.adobe.com') ?
        //pulls just the values out of the pagename in the lightroom domain we care about we care about
        processedpage = arrayFilter(pagearray, lightroomfilter) :
      //Stock Site Logic
      l.toLowerCase().match('^stock\.adobe\.com:..:(1|2|3[^\d]|4|5|6|7|8|9)|^stock\.adobe\.com:(1|2|3[^\d]|4|5|6|7|8|9)') ? 
        processedpage = 'stock.adobe.com:file' :
      l.match('^stock.adobe.com') ? 
          //pulls just the values out of the pagename in the stock domain we care about we care about
          processedpage = arrayFilter(pagearray, stockfilter) :
      //XD Site Logic
      l.match('^xd.adobe.com') ?
          //pulls just the values out of the pagename in the xd domain we care about we care about
          processedpage = arrayFilter(pagearray, xdfilter) :
      //Express Site Logic
      l.match('^express.adobe.com') ?
          //pulls just the values out of the pagename in the express domain we care about we care about
          processedpage = arrayFilter(pagearray, expressfilter) :
      //Account Management Site Logic
      l.match('^accounts*.adobe.com') ?
          //pulls just the values out of the pagename in the Account Management domain we care about we care about
          processedpage = arrayFilter(pagearray, accountfilter) :
      //Admin Console Site Logic
      l.match('^adminconsole.adobe.com') ?
          //pulls just the values out of the pagename in the admin console domain we care about we care about
          processedpage = arrayFilter(pagearray, adminconsolefilter) :
      //Community Site Logic
      l.match('^community.adobe.com') ?
          //pulls just the values out of the pagename in the community domain we care about we care about
          processedpage = arrayFilter(pagearray, communityfilter) :
      //Acrobat Site Logic
      l.match('^acrobat.adobe.com') ?
          //pulls just the values out of the pagename in the acrobat domain we care about we care about
          processedpage = arrayFilter(pagearray, acrobatfilter) :
      //Behance Site Logic
      l.match('^behance.net') ?
          //pulls just the values out of the pagename in the behance domain we care about we care about
          processedpage = arrayFilter(pagearray, behancefilter) :
      //Fonts Site Logic
      l.match('^fonts.adobe.com') ?
          //pulls just the values out of the pagename in the fonts domain we care about we care about
          processedpage = arrayFilter(pagearray, fontsfilter) :
      //Photoshop Site Logic
      l.match('^photoshop.adobe.com') ?
          //pulls just the values out of the pagename in the photoshop domain we care about we care about
          processedpage = arrayFilter(pagearray, photoshopfilter) :
      l.match('^plan.adobe.com') ?
          //pulls just the values out of the pagename in the photoshop domain we care about we care about
          processedpage = arrayFilter(pagearray, planfilter) :
      l.match('^color.adobe.com') ?
          //pulls just the values out of the pagename in the photoshop domain we care about we care about
          processedpage = arrayFilter(pagearray, colorfilter) :
      l.match('^creative.adobe.com') ?
          //pulls just the values out of the pagename in the photoshop domain we care about we care about
          processedpage = arrayFilter(pagearray, creativefilter) :
      l.match('^portfolio.adobe.com') ?
          //pulls just the values out of the pagename in the photoshop domain we care about we care about
          processedpage = arrayFilter(pagearray, portfoliofilter) :
      l.match('^schedule.adobe.com') ?
          //pulls just the values out of the pagename in the photoshop domain we care about we care about
          processedpage = arrayFilter(pagearray, schedulefilter) :
      l.match('^new.express.adobe.com') ?
          //pulls just the values out of the pagename in the photoshop domain we care about we care about
          processedpage = arrayFilter(pagearray, newexpressfilter ) :
      //404 Site Logic
      window.alloy_all.get('data.__adobe.target.is404') ?
          //pulls just the values out of the pagename in the stock domain we care about we care about
          processedpage = 'adobe.com:404' :
      //insert logic before line below with new additional site logic as needed
      processedpage;
  ['lightroom.adobe.com','stock.adobe.com','xd.adobe.com','express.adobe.com','accounts.adobe.com','account.adobe.com','adminconsole.adobe.com','community.adobe.com','acrobat.adobe.com','behance.net','fonts.adobe.com','photoshop.adobe.com','plan.adobe.com','color.adobe.com','creative.adobe.com','portfolio.adobe.com','schedule.adobe.com','new.express.adobe.com'].includes(processedpage) ? 
    processedpage = l : 
    processedpage;
  return processedpage;
};

return processPagenameLogic;

//LocalTime event.xdm.placeContext.localTime
localTimezoneOffset: new Date().getTimezoneOffset(),
localTime: (() => {
  const toISOStringLocal = (date => {
    const padStart = (string, targetLength, padString) => {
      return ("" + string).padStart(targetLength, padString);
    };
    const YYYY = date.getFullYear();
    const MM = padStart(date.getMonth() + 1, 2, "0");
    const DD = padStart(date.getDate(), 2, "0");
    const hh = padStart(date.getHours(), 2, "0");
    const mm = padStart(date.getMinutes(), 2, "0");
    const ss = padStart(date.getSeconds(), 2, "0");
    const mmm = padStart(date.getMilliseconds(), 3, "0");

    // The time-zone offset is the difference, in minutes, from local time to UTC. Note that this
    // means that the offset is positive if the local timezone is behind UTC and negative if it is
    // ahead. For example, for time zone UTC+10:00, -600 will be returned.
    const timezoneOffset = Number(date.getTimezoneOffset()) || 0;
    const ts = timezoneOffset > 0 ? "-" : "+";
    const th = padStart(Math.floor(Math.abs(timezoneOffset) / 60), 2, "0");
    const tm = padStart(Math.abs(timezoneOffset) % 60, 2, "0");
    return YYYY + "-" + MM + "-" + DD + "T" + hh + ":" + mm + ":" + ss + "." + mmm + ts + th + ":" + tm;
  });
  return toISOStringLocal(new Date());
})()


//AgiCampaigns events[0].data._adobe_corpnew.digitalData.adobe.experienceCloud.agiCampaign

var
  //_satellite = _satellite,
  consent = _satellite.getVar('consent');
if (consent.c('C0002')) {
  var w = window,
    loc = w.location,
    host = loc.hostname,
    path = loc.pathname,
    href = loc.href,
    cookieValue = _satellite.cookie.get('agiCamp'),
    index = function (str, substr) {
      return str.indexOf(substr) !== -1;
    },
    setAGICookie = function (val) {
      //var cookieValue = val;
      _satellite.cookie.set(
        'agiCamp',
        // Set the new value for the cookie
        val, {
          expires: 90,
          domain: _satellite.getVar('_getDomain')()
        }
      );
    };

  //Updated as per Jira ENB-4643, ENB-5760

  if (
    path.indexOf('/acrobat/campaign/acrobats-got-it.html') !== -1 &&
    href.search(/ttid=(all-in-one|reliable|versatile|combine-organize-e-sign|webforms-edit-e-sign)/) !== -1 &&
    (!cookieValue &&
      cookieValue !== '2')
  ) {
    setAGICookie('1');
    //console.log('inside 1');
    return _satellite.cookie.get('agiCamp');
  }
  else if (
    (host === 'acrobat.adobe.com' ||
      (host === 'www.adobe.com' &&
        path.search(/\/acrobat/) !== -1)) &&
    (!cookieValue ||
      cookieValue !== '1')

  ) {
    if (cookieValue == '2') {
      //console.log('inside false'); 
      return false;
    }
    setAGICookie('2');
    //console.log(_satellite.cookie.get('agiCamp'));
    return _satellite.cookie.get('agiCamp');
  } else {
    return false;
    //console.log('out side false');
  }
}    
return false;


//ENB-5621 - AGI Campaign
if ((p.indexOf('/acrobat/campaign/acrobats-got-it.html') !== -1 && href.search(/ttid=(all-in-one|reliable|versatile|combine-organize-e-sign|webforms-edit-e-sign)/) !== -1) || h === 'acrobat.adobe.com' || (h === 'www.adobe.com' && p.search(/\/acrobat/) !== -1)) {
  var agiCampaign = _satellite.getVar('digitalData.adobe.experienceCloud.agiCampaign'),
    setAgICampVal = false;
  if (agiCampaign && (agiCampaign == '1' || agiCampaign == '2')) {
    setAgICampVal = true;
    //alloy_all.set('data._adobe_corpnew.digitalData.adobe.experienceCloud.agiCampaign', '1');
  }
}

{
  t5 = t4.experienceCloud = t4.experienceCloud || {};
  {
    
    if (dxhits && dxhits == "2"){
    t5.dxVisits = 'setEvent';
    }
    if (secondHit && secondHit == 2){
    t5.secondVisits = 'setEvent';
    }
    if(adobeHit && adobeHit == "2"){
    t5.adobeVisit = 'setEvent';
    }
    if (acrobatSecondHit && acrobatSecondHit == 2){
    t5.acrobatSecondVisits = 'setEvent';
    }

    t5.agiCampaign = (setAgICampVal) ? agiCampaign : '';


  //gpc events[0].data._adobe_corpnew.digitalData.adobe.gpc
  t4.gpc = navigator ? (navigator.globalPrivacyControl ? navigator.globalPrivacyControl.toString() : '') : '';

  //eventmergeid events[0].data.eventMergeId
  if (mergeId) {
    event.mergeXdm({
      eventMergeId: mergeId
    });
  }
  var createEventMergeId = () => {
    return {
      eventMergeId: v4()
    };
  };
  var createComponent$2 = ({
    createEventMergeId
  }) => {
    return {
      commands: {
        createEventMergeId: {
          run: createEventMergeId
        }
      }
    };
  };
  const createEventMerge = () => {
    return createComponent$2({
      createEventMergeId
    });
  };
  createEventMerge.namespace = "EventMerge";

  alloy('createEventMergeId')
  .then(function (result) {
    alloy_all.xdm.eventMergeId = result.eventMergeId;
  })

  //acrobat second visits events[0].data._adobe_corpnew.digitalData.adobe.experienceCloud.acrobatSecondVisits
  var consent = _satellite.getVar("consent"),
  acrobatSecondVisit = false,
  increment = event && event.increment; //This flag is to make sure we are not incrementing the cookie value, when called from alloy_privacy data element with {increment : false}    

consent("C0002", function () {
  var 
      w = window,
    loc = w.location,
    host = loc.hostname,
    path = loc.pathname,
    attempt = Number(localStorage.getItem("acrobatSecondHit")),
    setSecondPageviewVisit = function () {
      if(attempt == 0) {
        ++attempt;
      } else {
        attempt++;
      }
      localStorage.setItem(
        "acrobatSecondHit",
        // Set the new value for the acrobatSecondHit
        attempt
      );
    };    

  if ((host === "www.adobe.com" || host === "www.stage.adobe.com") && /\/acrobat/.test(path)) {
    if (!attempt || attempt <= 2) {
      if(increment !== false) {
        setSecondPageviewVisit();
      }
      acrobatSecondVisit = attempt ; 
    }
  }
  //return false;
});
return acrobatSecondVisit;

acrobatSecondHit = Number(_satellite.getVar("digitalData.adobe.experienceCloud.acrobatSecondVisits")); //ENB-7582
if (acrobatSecondHit && acrobatSecondHit == 2){
  t5.acrobatSecondVisits = 'setEvent';
  }


  //entity id events[0].data.__adobe.target["entity.id"]
     //data.__adobe.target.entity.id
     if (_satellite.getVar('mbox_parameter_entityId')) {
      t3["entity.id"] = _satellite.getVar('mbox_parameter_entityId');
    }
//mbox_parameter_entityId
    if (window.location.href == "https://www.adobe.com/express/") {
      return "a2c4e4e4-eaa9-11ed-a05b-0242ac120003";
    } else {
      var meta = document.getElementsByTagName('meta');
      return meta && meta.entity_id && meta.entity_id.getAttribute('content');
    }


//SKU events[0].xdm.productListItems[0].SKU
//ENB-6656- Adding Primary Product Name for DX Products
productName = document.querySelector('meta[name="primaryproductname"]');
if(productName && productName.content) {
  alloy_pageView.data.productListItems=[
    {
      "SKU":productName.content
    }];
} 

//Language events[0].data._adobe_corpnew.digitalData.page.pageInfo.language
//digitalData.page.pageInfo.language

var w = window,
  _sat = _satellite,
  isMilo = _sat.getVar('isMilo'),
  locale = w.alloy_all.get('data._adobe_corpnew.digitalData.page.pageInfo.language.locale');

// Execute this If block only it it is a Milo page & locale property existing (allow the empty string for US)
if(isMilo && locale !== undefined && locale !== null){

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

else {
  
  var tempLanguage = window.alloy_all.get('data._adobe_corpnew.digitalData.page.pageInfo.language'),
    tempLanguageFinal;

  if (tempLanguage && typeof tempLanguage === 'string') {

    if (tempLanguage.indexOf('_') !== -1) {
      tempLanguage = tempLanguage.split('_');
      if (tempLanguage && tempLanguage.length == 2) {
        tempLanguageFinal = (tempLanguage[0] && tempLanguage[1]) ? tempLanguage[0].toLowerCase() + '-' + tempLanguage[1].toUpperCase() : '';
      } else if (tempLanguage && tempLanguage.length == 3) {
        tempLanguageFinal = (tempLanguage[0] && tempLanguage[1] && tempLanguage[2]) ? tempLanguage[0].toLowerCase() + '-' + tempLanguage[1].toLowerCase() + '-' + tempLanguage[2].toUpperCase() : '';
      }
    }

    if(tempLanguageFinal) {
      return tempLanguageFinal;
    }

    return tempLanguage;

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
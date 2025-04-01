
    const SIGNIN_CONTEXT = getConfig()?.signInContext;
// signIn, decorateSignIn and decorateProfileTrigger can be removed if IMS takes over the profile
const signIn = (options = {}) => {
  if (typeof window.adobeIMS?.signIn !== 'function') {
    lanaLog({
      message: 'IMS signIn method not available',
      tags: 'errorType=warn,module=gnav'
    });
    return;
  }
  window.adobeIMS.signIn(options);
};
const closeOnClickOutside = (e, isLocalNav, navWrapper) => {
  if (isLocalNav && navWrapper.classList.contains('feds-nav-wrapper--expanded')) return;
  const newMobileNav = getMetadata('mobile-gnav-v2') !== 'false';
  if (!isDesktop.matches && !newMobileNav) return;
  const openElemSelector = `${selectors.globalNav} [aria-expanded = "true"]:not(.universal-nav-container *), ${selectors.localNav} [aria-expanded = "true"]`;
  const isClickedElemOpen = [...document.querySelectorAll(openElemSelector)].find(openItem => openItem.parentElement.contains(e.target));
  if (!isClickedElemOpen) {
    closeAllDropdowns();
  }
};
    document.querySelectorAll('.global-navigation').forEach(block => {
      
        (function(){
        const conditionMethod = function(ob){
        return !!ob.block.rawElem.querySelector('.global-navigation div:nth-child(2)')
      } || (() => true);
        const isSuccess = conditionMethod({block});
        if(!isSuccess) {
          return false;
        }

        const scopeResolver = () => ({
           
        });
        const scopeObject = scopeResolver();
        const scopeResult = {};

        for (const key in scopeObject) {
          if (typeof scopeObject[key] === 'function') {
            scopeResult[key] = scopeObject[key]({block});
          }
        }
        
        block.querySelectorAll('.feds-signIn').forEach(el => {
          const paramResolver = () => ({
            
          });
          el.addEventListener('click', (e) => {
            const paramsObject = paramResolver();
            const result = {};

            for (const key in paramsObject) {
              if (typeof paramsObject[key] === 'function') {
                result[key] = paramsObject[key]({target:el, block}); // Execute function and store result
              }
            }

            
           (e => {
  e.preventDefault();
  signIn(SIGNIN_CONTEXT);
})(e);
          });
        });})();

        (function(){
        const conditionMethod = function(ob){
        return !ob.block.rawElem.querySelector('.global-navigation div:nth-child(2)')
      } || (() => true);
        const isSuccess = conditionMethod({block});
        if(!isSuccess) {
          return false;
        }

        const scopeResolver = () => ({
           
        });
        const scopeObject = scopeResolver();
        const scopeResult = {};

        for (const key in scopeObject) {
          if (typeof scopeObject[key] === 'function') {
            scopeResult[key] = scopeObject[key]({block});
          }
        }
        
        block.querySelectorAll('.feds-signIn').forEach(el => {
          const paramResolver = () => ({
            
          });
          el.addEventListener('click', (e) => {
            const paramsObject = paramResolver();
            const result = {};

            for (const key in paramsObject) {
              if (typeof paramsObject[key] === 'function') {
                result[key] = paramsObject[key]({target:el, block}); // Execute function and store result
              }
            }

            
           (e => trigger({
  element: signInElem,
  event: e
}))(e);
          });
        });})();
    });
  
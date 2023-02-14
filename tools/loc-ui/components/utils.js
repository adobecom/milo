// FIXME: copy only applies to copy-only projects and en and en-gb. en and en-gb can be saved directly
// for them, copy goes straight to saved
// otherwise, copy means copying from source to langstore. save means from glaas to langstore

// FIXME: consolidate the possible states
export const itemStatus = ['initial', 'copied', 'glassIP', 'glaasComplete', 'saved', 'rolledout'];

export const stateFuncs = {
  canCopy: (state) => state === 'initial',
  canSendToGlaaS: (state) => state === 'copied',
  canGlaaSComplete: (state) => state === 'glassIP',
  canSave: (state) => state === 'glaasComplete',
  canRollout: (state) => state === 'saved',
};

export const actionToNextState = (curr, locale) => {
  if (curr === 'initial' && (locale === 'en' || locale === 'en-gb')) {
    return 'save';
  }
  return {
    initial: 'copy',
    copied: 'send to glaas',
    glassIP: 'complete in glaas',
    glaasComplete: 'save',
    saved: 'rollout',
    rolledout: 'rollout',
  }[curr];
};

export const moveStateForward = (curr, locale) => {
  if (curr === 'initial' && (locale === 'en' || locale === 'en-gb')) {
    return 'saved';
  }
  const idx = itemStatus.indexOf(curr);
  if (idx === itemStatus.length - 1) {
    return curr;
  }
  const newState = itemStatus[idx + 1];
  return newState;
};

export const updateState = (stateSignal, updateFunc) => {
  const cloned = structuredClone(stateSignal.value);
  stateSignal.value = updateFunc(cloned);
  return stateSignal;
};

// export const getUpdatedAllItemsOfOneLocale = (clonedStates, locale) => {
//   const itemsMap = clonedStates.subprojectStates[locale].items;
//   const copiedItemsMap = structuredClone(itemsMap);
//   Object.keys(copiedItemsMap).forEach((url) => {
//     const item = copiedItemsMap[url];
//     if (!filterFunc(item.status)) return;
//     item.status = moveStateForward(item.status, locale);
//   });
//   return { ...clonedStates, subprojectStates: { ...clonedStates.subprojectStates, [locale]: { ...clonedStates.subprojectStates[locale], items: copiedItemsMap } } };
// };

export const updateOneLocaleOneItem = (stateSignal, locale, url) => {
  const updateFunc = (clonedStates) => {
    const itemsMap = clonedStates.subprojectStates[locale].items;
    const item = itemsMap[url];
    item.status = moveStateForward(item.status, locale);
    return clonedStates;
  };
  return updateState(stateSignal, updateFunc);
};

export const updateOneLocaleAllItems = (stateSignal, locale, filterFunc) => {
  const updateFunc = (clonedStates) => {
    const itemsMap = clonedStates.subprojectStates[locale].items;
    Object.keys(itemsMap).forEach((url) => {
      const item = itemsMap[url];
      if (!filterFunc(item.status)) return;
      item.status = moveStateForward(item.status, locale);
    });
    return clonedStates;
  };
  return updateState(stateSignal, updateFunc);
};

// TODO: confirm color
export const colors = ['#E9E9E9', '#FED3E9', '#F8F786', '#B1D9F5'];

/**
 * Dynamic Hydration Runtime Code
 * This module provides runtime functionality for hydrating components on the client side.
 */

/**
 * Performs client-side hydration dynamically at runtime using only 'id'.
 * Processes raw hydration data collected during SSR, finds corresponding
 * code block definition using 'id', resolves elements, and executes the code.
 * Replaces build-time generation of individual init_X functions.
 *
 * @param {Array<object>} rawHydratorData Raw hydration data array from SSR.
 * Example element: {id: 0, elements: {param1: "sh-id"}, data: {param3: "value"}}
 * @param {Array<object>} blockDefinitions Array defining hydration code blocks.
 * Example element: {id: 0, code: "console.log(param1);"}
 * 'id' must uniquely identify a code block in this version.
 */
export function hydrateDynamically(rawHydratorData, blockDefinitions=[]) {
  // 1. Validate Inputs
  if (!Array.isArray(rawHydratorData)) {
    console.error("Dynamic Hydration (ID Only) failed: rawHydratorData must be an array.", rawHydratorData);
    return;
  }
  if (!Array.isArray(blockDefinitions)) {
    console.error("Dynamic Hydration (ID Only) failed: blockDefinitions must be an array.", blockDefinitions);
    return;
  }
  if (rawHydratorData.length === 0) {
    console.log("No raw hydration data found.");
    return;
  }
  if (blockDefinitions.length === 0) {
    console.log("No hydration block definitions found.");
    // return;
  }

  console.log(`Starting dynamic hydration (ID Only). Found ${rawHydratorData.length} raw tasks and ${blockDefinitions.length} block definitions.`);

  // Create a map from blockDefinitions using only ID for faster lookups
  const blockMap = new Map();
  blockDefinitions.forEach(def => {
    // Check if definition has required fields (id and code)
    if (def && def.id !== undefined && typeof def.code === 'string') {
      const blockId = def.id; // Use ID as the key
      if (blockMap.has(blockId)) {
        // Warn about duplicates but allow last one to win
        console.warn(`Duplicate block definition found for id: ${blockId}. Last definition will be used.`);
      }
      blockMap.set(blockId, def.code);
    } else {
      console.warn("Invalid block definition encountered during map creation (missing id or code):", def);
    }
  });

//   if (blockMap.size === 0) {
//     console.error("No valid block definitions were processed into the lookup map. Cannot proceed.");
//     return;
//   }

  // 2. Process each raw hydration task instance from SSR
  rawHydratorData.forEach((rawTask, taskIndex) => {
    // Validate raw task structure needed for processing (only need id)
    if (!rawTask || typeof rawTask !== 'object' || rawTask.id === undefined) {
      console.warn(`Skipping invalid raw hydration task at index ${taskIndex} (missing id):`, rawTask);
      return;
    }

    // Find the corresponding code string using only the ID
    const blockId = rawTask.id;
    const blockCodeString = blockMap.get(blockId);

    // Skip if no code found for this task's block definition ID
    // if (blockCodeString === undefined) {
    //   console.warn(`No code definition found for block id "${blockId}" (Task index ${taskIndex}). Skipping task.`);
    //   return;
    // }

    try {
      const resolvedArgs = {}; // Holds resolved elements and data for this instance

      // 3. Resolve DOM Elements for this task instance
      const rawElements = rawTask.elements || {};
      for (const key in rawElements) {
        const idOrIds = rawElements[key];
        let selector = null;
        let isMultiple = false;

        if (Array.isArray(idOrIds)) {
          if (idOrIds.length > 0) {
            selector = idOrIds
              .map(mId => typeof mId === 'string' ? `[data-hydrate-multi="${mId}"]` : null)
              .filter(s => s !== null)
              .join(',');
            isMultiple = true;
            if (!selector) {
              console.warn(`Dynamic Hydration (ID: ${blockId}, Task: ${taskIndex}, Key: ${key}): No valid multi-IDs found in array:`, idOrIds);
              resolvedArgs[key] = document.querySelectorAll(`.non-existent-class-${Date.now()}`);
              continue;
            }
          } else {
            console.warn(`Dynamic Hydration (ID: ${blockId}, Task: ${taskIndex}, Key: ${key}): Empty array provided for multi-element IDs.`);
            resolvedArgs[key] = document.querySelectorAll(`.non-existent-class-${Date.now()}`);
            continue;
          }
        } else if (typeof idOrIds === 'string' && idOrIds.startsWith('sh-')) {
          selector = `[data-hydrate-id="${idOrIds}"]`;
          isMultiple = false;
        } else {
          console.warn(`Dynamic Hydration (ID: ${blockId}, Task: ${taskIndex}, Key: ${key}): Invalid element ID format found:`, idOrIds);
          resolvedArgs[key] = null;
          continue;
        }

        if (selector) {
          const elementsNodeList = document.querySelectorAll(selector);
          if (isMultiple) {
            resolvedArgs[key] = elementsNodeList;
            if (elementsNodeList.length === 0) {
              console.warn(`Dynamic Hydration (ID: ${blockId}, Task: ${taskIndex}, Key: ${key}): No elements found for selector '${selector}'`);
            }
          } else {
            resolvedArgs[key] = elementsNodeList[0] || null;
            if (!resolvedArgs[key]) {
              console.warn(`Dynamic Hydration (ID: ${blockId}, Task: ${taskIndex}, Key: ${key}): No element found for selector '${selector}'`);
            }
          }
        } else {
          resolvedArgs[key] = isMultiple ? document.querySelectorAll(`.non-existent-class-${Date.now()}`) : null;
        }
      }

      // 4. Merge Static Data for this task instance
      const rawData = rawTask.data || {};
      for (const key in rawData) {
        if (resolvedArgs.hasOwnProperty(key)) {
          console.warn(`Dynamic Hydration (ID: ${blockId}, Task: ${taskIndex}, Key: ${key}): Data key clashes with element key. Data value will be used.`);
        }
        resolvedArgs[key] = rawData[key];
      }

      // 5. Prepare for Code Execution
      const argNames = Object.keys(resolvedArgs);
      const argValues = argNames.map(name => resolvedArgs[name]);
      console.log(argNames);

      hydrationBlocks[`block_${rawTask.id}`](resolvedArgs);

      // 6. Execute the User's Hydration Code for this specific instance
      // const hydrateAction = new Function(...argNames, blockCodeString);
      // const hydrateAction = function (...argValues) { eval(blockCodeString) };
      // hydrateAction(...argValues);

    } catch (error) {
      console.error(`Error during dynamic hydration execution (ID: ${blockId}, Task Index: ${taskIndex}):`, error, "Task details:", rawTask);
    }
  });

  console.log("Dynamic hydration process finished (ID Only).");
}

/**
 * Initializes dynamic hydration when the DOM is ready
 */
export function initializeDynamicHydration() {
  // Assumes window.__HYDRATOR_DATA__ (raw SSR data array) and
  // window.__BLOCK_DEFINITIONS__ (block definitions array) are populated globally
  const token = hydrationToken;
  const rawData = (window.hydrateData || []).filter(data => data.file === token);
  const blockDefs = (window.code || [])[token];
  

  // Call the main hydration function
  hydrateDynamically(rawData, blockDefs);
}

// Run after DOM is ready
if (typeof document !== 'undefined') {
  initializeDynamicHydration();
} 
window.__hydrate__ = [];

/* eslint-disable no-console */
function generateId() {
  // Simple random ID generator
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Function to ensure an element/list has unique hydration ID(s)
// Returns a single ID string (sh-...) for single elements
// Returns an array of unique group IDs (mh-...) for lists
function ensureHydrateId(elements) {
  if (!elements) return null; // Handle null/undefined input

  // Check if it's an array-like structure (NodeList, Array) with elements
  // Note: Single HTMLElements do not have .length property
  if (typeof elements.length === 'number' && elements.length > 0) {
    let ids = new Set(); // Store unique multi-IDs found/created for this list
    let assignedMultiId = null; // Track the ID assigned in *this* pass if needed

    // Iterate through the list (works for NodeList and Array)
    elements.forEach((el) => {
      if (!(el instanceof HTMLElement)) {
         console.warn('Item in list passed to hydrate is not an HTMLElement:', el);
         return; // Skip non-elements in the list
      }
      let existingMultiId = el.getAttribute('data-hydrate-multi');
      if (!existingMultiId) {
        // Element doesn't belong to a multi-group yet
        if (!assignedMultiId) {
          // Assign a new multi-ID for this group during this hydrate call
          assignedMultiId = `mh-${generateId()}`;
        }
        el.setAttribute('data-hydrate-multi', assignedMultiId);
        ids.add(assignedMultiId); // Add the newly assigned ID
      } else {
        // Element already belongs to a group, just record its ID
        ids.add(existingMultiId);
      }
    });
    // Return array of all unique multi-group IDs involved
    return Array.from(ids);
  } else if (elements instanceof HTMLElement) {
    // Handle single HTMLElement
    let id = elements.getAttribute('data-hydrate-id');
    if (!id) {
      id = `sh-${generateId()}`;
      elements.setAttribute('data-hydrate-id', id);
    }
    return id; // Return the single ID string
  } else if (elements.length === 0) {
      // Handle empty NodeList/Array explicitly if needed, though it returns null below anyway
      return []; // Return empty array for consistency? Or null? Let's stick to null based on initial check.
  }

  // If it's not an HTMLElement or a non-empty list, return null
  console.warn('Value passed for hydration is not a valid HTMLElement or list:', elements);
  return null;
}

window.hydrate = function(config) {
  // Destructure config for clarity
  const { id, payload } = config;

  // Basic validation
  if (id === undefined || id === null) {
    console.error('Hydration config must include an "id".');
    return;
  }

  let file = null;
  try {
    throw new Error();
  } catch (e) {
    const stackLines = e.stack.split('\n');
    const callerLine = stackLines[2] || stackLines[1];

    const match = callerLine.match(/(https?:\/\/.+?):\d+:\d+/);
    if (match && match[1]) {
      const url = new URL(match[1]);
      const segments = url.pathname.split('/').filter(Boolean); // remove empty strings
      file = segments.slice(-2).join('/');
    }
  }
  const task = {
    id,
    file,
    elements: {},
    data: {},
  };

  // Process the payload object to categorize items
  Object.entries(payload||{}).forEach(([key, value]) => {
    // Attempt to get hydration ID(s) for the value
    const hydrationIdInfo = ensureHydrateId(value);

    if (hydrationIdInfo !== null) {
      // If ensureHydrateId returned an ID string or an array of IDs, treat as element(s)
      task.elements[key] = hydrationIdInfo;
    } else if (value !== null && !(value instanceof HTMLElement) && typeof value?.length !== 'number'){
      // If it wasn't recognized as an element/list by ensureHydrateId,
      // and it's not null/HTMLElement/array-like, treat it as data.
      // (We re-check null/HTMLElement/length here for safety, though ensureHydrateId handles most)
      try {
        // Attempt to stringify/parse to ensure valid JSON & deep clone primitive/plain objects/arrays
        task.data[key] = JSON.parse(JSON.stringify(value));
      } catch (e) {
        console.warn(`Hydration (id: ${id}): Could not serialize data for key "${key}". Skipping. Error:`, e);
        // Optionally store a placeholder like null or skip the key
        // task.data[key] = null;
      }
    }
    // If value is null or an empty list, ensureHydrateId returns null,
    // and it won't match the 'else if' either, so it's correctly skipped.
  });
  window.__hydrate__.push(task);
};
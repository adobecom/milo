import fs from 'fs';
import path from 'path';

/**
 * Replaces custom hydration comment patterns in a code string
 * with window.hydrate function calls, allowing optional space after //.
 *
 * Pattern from: // @hydrate.ID({payload:PAYLOAD_OBJECT}) or //@hydrate.ID({payload:PAYLOAD_OBJECT})
 * Pattern to:   window.hydrate && window.hydrate({id:ID, payload:PAYLOAD_OBJECT})
 *
 * @param {string} codeString The input string containing code and comments.
 * @returns {string} The code string with comments replaced.
 */
function transformHydrationAnnotations(codeString) {
    if (typeof codeString !== 'string') {
      return codeString; // Return input if not a string
    }
  
    // Regex Explained: (Same as before)
    // \/\/          : Matches "//"
    // \s* : Optional whitespace
    // @hydrate\.    : Matches "@hydrate."
    // (\d+)         : Capture group 1: ID (digits)
    // (?:           : Start optional non-capturing group for payload
    //   \({payload: : Matches "({payload:"
    //   ({.*?\})    : Capture group 2: Payload object literal (non-greedy)
    //   }\)         : Matches "})"
    // )?            : End optional group - makes payload part optional
    // g             : Global flag
    const regex = /\/\/\s*@hydrate\.(\d+)(?:\({payload:({.*?})}\))?/g;

    // Use string.replace with a replacer function
    const transformedCode = codeString.replace(regex, (match, id, payloadObject) => {
        // id: The captured ID string (e.g., "0" or "2")
        // payloadObject: The captured payload object string (e.g., "{button}")
        //                OR it will be === undefined if the payload part didn't match.

        // **Conditional Logic is Key Here**
        if (payloadObject !== undefined) {
        // Payload exists: include both id and payload
        // Ensure payloadObject (which includes braces) is interpolated correctly
        return `window.hydrate && window.hydrate({id:${id}, payload:${payloadObject}})`;
        } else {
        // Payload does NOT exist: include ONLY id
        return `window.hydrate && window.hydrate({id:${id}})`;
        }
    });
  
    return transformedCode;
} 

/**
 * Processes a file and transforms its hydration annotations
 * @param {string} filePath - Path to the file to process
 */
export function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const transformedContent = transformHydrationAnnotations(content);
  fs.writeFileSync(filePath, transformedContent);
}

/**
 * Processes all files in a directory recursively
 * @param {string} directory - Directory to process
 */
export function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      processFile(filePath);
    }
  });
} 
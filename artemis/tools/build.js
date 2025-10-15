import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { processDirectory } from './transform-hydration.js';
import { extractAllComponents } from './extract-all.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
export const config = {
    // Source directory (relative to Milo root)
    sourceDir: '../milo/libs',
    // Project temp directory name
    projectTempDir: './',
    // Destination folder name within project temp
    destFolderName: 'libs'
};

/**
 * Copies a directory recursively
 * @param {string} source - Source directory path
 * @param {string} destination - Destination directory path
 */
function copyDirectory(source, destination) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    // Read the source directory
    const entries = fs.readdirSync(source, { withFileTypes: true });

    for (const entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const destPath = path.join(destination, entry.name);

        if (entry.isDirectory()) {
            // Recursively copy subdirectories
            copyDirectory(sourcePath, destPath);
        } else {
            // Copy files
            fs.copyFileSync(sourcePath, destPath);
        }
    }
}

/**
 * Main function to copy the lib directory
 */
export function copyLibDirectory() {
    try {
        // Get Milo root directory (assuming this script is in tools directory)
        const miloRoot = path.resolve(__dirname, '..');
        const sourcePath = path.join(miloRoot, config.sourceDir);

        // Check if source directory exists
        if (!fs.existsSync(sourcePath)) {
            throw new Error(`Source directory ${sourcePath} does not exist`);
        }

        // Create project temp directory path
        const projectTempPath = path.join(miloRoot, config.projectTempDir);
        const destPath = path.join(projectTempPath, config.destFolderName);

        // Ensure project temp directory exists
        if (!fs.existsSync(projectTempPath)) {
            fs.mkdirSync(projectTempPath, { recursive: true });
        }

        console.log(`Copying ${config.sourceDir} from Milo root to ${destPath}`);
        
        // Perform the copy
        copyDirectory(sourcePath, destPath);
        
        console.log('Copy completed successfully!');
        console.log(`Files copied to: ${destPath}`);
        
        return destPath;
    } catch (error) {
        console.error('Error copying directory:', error.message);
        throw error;
    }
}



// If this script is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    // 1. Copy the lib directory
    // 2. Run the hydration runtime
    // 3. Replace annoation to hydration functions
    // 4. Run `aem up`
    // 5.Run headless script and Generate the output.json and
    copyLibDirectory();
    await extractAllComponents()
    processDirectory(config.projectTempDir);
}

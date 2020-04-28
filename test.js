
// Local path to a directory with the project (use backslashes):
const localPath = "C:\\Users"; //important: use double backslashes

// Share name on Azure:
const shareName = "exampleShareName";

// Root directory name:
const originalDirectoryName = `exampleDirName`;

const synchronizeProjectOnAzure = require('./src/synchronizeProjectOnAzure.js');
synchronizeProjectOnAzure(localPath, originalDirectoryName, shareName);
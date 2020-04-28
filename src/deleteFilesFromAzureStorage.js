const deleteFilesFromAzureStorage = function (shareName, directoryName, filesToDelete) {
    let storage = require('azure-storage');
    const readConfig = require('./readConfig.js');

    for(let i = 0; i < filesToDelete.length; i++) {
      directoryName = filesToDelete[i].directory;
      directoryName = directoryName.split("/").join("\\\\");
      let fileName = filesToDelete[i].name;
      deleteFileFromAzureStorage(shareName, directoryName, fileName);
    }
    
    function deleteFileFromAzureStorage(shareName, directoryName, fileName) {
      let fileService = storage.createFileService(readConfig().connectionString);
      fileService.deleteFileIfExists(shareName, directoryName, fileName, function (error) {
      });
    }
}

module.exports = deleteFilesFromAzureStorage;
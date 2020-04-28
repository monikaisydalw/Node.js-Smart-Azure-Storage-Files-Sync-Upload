const createListsToUploadAndDelete = function (localFilesList, azureFilesList) {
    
    let filesToDelete = []; 
    let filesToUpload = []; 
    let filesToSkip = [];

    // In localFilesList find collection of files to skip and to upload on Azure storage

    for(let i = 0; i < localFilesList.length; i++) {
      let ifExistsOnAzure = 0;

      for(let a = 0; a < azureFilesList.length; a++) {
        if (localFilesList[i].name === azureFilesList[a].name && localFilesList[i].directory === azureFilesList[a].directory && localFilesList[i].date <= azureFilesList[a].date) {
          filesToSkip.push(localFilesList[i]);
          ifExistsOnAzure = 1;
        }
        else if (localFilesList[i].name === azureFilesList[a].name && localFilesList[i].directory === azureFilesList[a].directory && localFilesList[i].date > azureFilesList[a].date) {
          filesToUpload.push(localFilesList[i]);
          ifExistsOnAzure = 1;
        }
      }

      if(ifExistsOnAzure === 0) {
        filesToUpload.push(localFilesList[i]);
      }
    }

    // In azureFilesList find collection of files that should be deleted

    for(let i = 0; i < azureFilesList.length; i++) {
      let ifExistsOnlyOnAzure = 1;

      for(let a = 0; a < localFilesList.length; a++) {
        if (azureFilesList[i].name === localFilesList[a].name && azureFilesList[i].directory === localFilesList[a].directory) {
          ifExistsOnlyOnAzure = 0;
        }
      }

      if(ifExistsOnlyOnAzure === 1) {
        filesToDelete.push(azureFilesList[i]);
      }
    }
    console.log("Collection of files that should be skipped:");
    console.log(filesToSkip.length);
    console.log("Files to upload:");
    console.log(filesToUpload.length);
    console.log("Files to delete:");
    console.log(filesToDelete.length);

    const filesToChange = {
      "filesToUpload" : filesToUpload, 
      "filesToDelete" : filesToDelete
    };

    return filesToChange;
}

module.exports = createListsToUploadAndDelete;
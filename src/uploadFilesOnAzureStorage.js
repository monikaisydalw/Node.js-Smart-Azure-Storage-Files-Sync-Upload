const uploadFilesOnAzureStorage = function (shareName, directoryName, filesToUpload, localPath) {
        let uploadCounter = 0;
        let errorCounter = 0;
        let errorsCollection =[];
        const storage = require('azure-storage');
        const readConfig = require('./readConfig.js');
      
        (async function() {
        for(let i = 0; i < filesToUpload.length; i++) {
          if(i%20 === 0) {await new Promise(resolve => setTimeout(resolve, 5000)) }
          
          let fileName = filesToUpload[i].name;
          let fileToUpload = filesToUpload[i].directory.split("/");
          fileToUpload = fileToUpload.slice(1, fileToUpload.length);
          fileToUpload = fileToUpload.join("\\");
          if(fileToUpload != "") {
            fileToUpload = localPath + "\\" + fileToUpload + "\\" + fileName;
          }
          else {
            fileToUpload = localPath + "\\" + fileName;
          }
            directoryName = filesToUpload[i].directory;
            uploadFileOnAzureStorage(shareName, directoryName, fileName, fileToUpload);
        }
      })()
  
  
  function uploadFileOnAzureStorage(shareName, directoryName, fileName, fileToUpload) {
      let fileService = storage.createFileService(readConfig().connectionString);
      fileService.createShareIfNotExists(shareName, function (error) {
        if (error) {
          console.log(error.message, " error from createShareIfNotExists");
        } else {      
          // Create a directory under the root directory
          directoryName = directoryName.split("/");
          let dirAuxiliary = directoryName[0];
  
          (async function() {
            for(let iter = 0; iter < directoryName.length; iter++){
                await new Promise(next => {
                  fileService.createDirectoryIfNotExists(shareName, dirAuxiliary, function (error) {
                    if (iter === directoryName.length-1) {  
                       fileService.createFileFromLocalFile(shareName, directoryName.join("/"), fileName, fileToUpload, function (error, result, response) {
                        if(error) {
                          console.log(error.message, errorCounter+=1, uploadCounter, fileName);
                          errorsCollection.push(filesToUpload[i]);
                        }
                        if(result) {
                        }
                        if(response) {
                          //console.log(response.isSuccessful);
                        }
                        uploadCounter +=1;
                        //if (uploadCounter > 100) {console.log(uploadCounter);}
                      });
                    } else if (iter < directoryName.length) {
                      dirAuxiliary = dirAuxiliary + "/"+ directoryName[iter+1];
                      next(); 
                    }
                  });
                    
                })
              }
          })()
      }
    });
  
  }   
}   

module.exports = uploadFilesOnAzureStorage;
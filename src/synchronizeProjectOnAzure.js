const synchronizeProjectOnAzure = function(localPath, originalDirectoryName, shareName) {
 
    let originalLocalDirectory = localPath.split("\\").join("//");


    //Read all directories and files of given local path
    const readAllDirectoriesAndFiles = require('./listAllDirectoriesAndFiles.js');
    readAllDirectoriesAndFiles(originalLocalDirectory, localPath, originalDirectoryName, function(err, results) {
        if (err) throw err;
        console.log("This is collection of all local files in given directory:")
        console.log(results.length);
        updateAzureStorage(results, originalLocalDirectory).catch((err) => {
            console.error("Error running sample:", err.message);
        });
    });

     // Get list of all directories and files in given directory
     const listAllAzureFiles = function(directoryClient, directoryName, shareClient, localFilesList) {

        let results = 0;
        let azureFilesList = [];
        let numberOfDirectories = 0;
        let searchOnLevelClosed = 0;

        listAllAzureFilesAsync(directoryClient, directoryName);

        async function listAllAzureFilesAsync(directoryClient, directoryName) {

            directoryClient = shareClient.getDirectoryClient(directoryName);
            let iter = directoryClient.listFilesAndDirectories();
            for await (const entity of iter) {

                if (entity.kind === "directory") {
                    listAllAzureFilesAsync(directoryClient, directoryName + "/" + entity.name);
                    numberOfDirectories = numberOfDirectories + 1;
                } else {
                    let fileClient = directoryClient.getFileClient(entity.name);
                    const fileProp = await fileClient.getProperties();
                    azureFilesList.push({
                        "name": entity.name,
                        "directory": directoryName,
                        "date": fileProp.lastModified
                    });
                    results += 1;
                }

            }

            iter.next().then(x => {
                if (x.done === true) {
                    searchOnLevelClosed += 1;
                    if (searchOnLevelClosed > numberOfDirectories) {
                        console.log("This is collection of all files on Azure (quantity):");
                        console.log(azureFilesList.length);

                        const createListsToUploadAndDelete = require('./createListsToUploadAndDelete.js');
                        let filesToChange = createListsToUploadAndDelete(localFilesList, azureFilesList);

                        // Delete all files to delete from Azure (array filesToDelete)
                        const deleteFilesFromAzureStorage = require('./deleteFilesFromAzureStorage.js');
                        deleteFilesFromAzureStorage(shareName, directoryName, filesToChange.filesToDelete);

                        // Upload files on Azure Storage (array filesToUpload)
                        const uploadFilesOnAzureStorage = require('./uploadFilesOnAzureStorage.js');
                        uploadFilesOnAzureStorage(shareName, directoryName, filesToChange.filesToUpload, localPath);
                    }
                }
            });

        }
    }


    async function updateAzureStorage(localFilesList, originalLocalDirectory) {
        
        // Copyright (c) Microsoft Corporation.
        // Licensed under the MIT license.

        const createAzureShare = function() {
            const {
                ShareServiceClient,
                StorageSharedKeyCredential
            } = require("@azure/storage-file-share");
            const readConfig = require('./readConfig.js');
            // Get storage account name and shared key
            const account = readConfig().accountName;
            const accountKey = readConfig().accountKey;
            const shareServiceUrl = `https://${account}.file.core.windows.net`

            // Use StorageSharedKeyCredential with storage account and account key
            // StorageSharedKeyCredential is only avaiable in Node.js runtime, not in browsers
            const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

            const serviceClient = new ShareServiceClient(
                // When using AnonymousCredential, following url should include a valid SAS
                shareServiceUrl,
                sharedKeyCredential
            );

            // Create a share
            originalLocalDirectory = originalLocalDirectory.split("\\");
            originalLocalDirectory = originalLocalDirectory[originalLocalDirectory.length - 1];

            let shareClient = serviceClient.getShareClient(shareName);
            console.log(`Create share ${shareName} successfully`);
            return shareClient;
        }

        const shareClient = createAzureShare();
        let directoryName = originalDirectoryName;
        let directoryClient = shareClient.getDirectoryClient(directoryName);

        await directoryClient.create().catch(error => new Error(error.details.message));
        listAllAzureFiles(directoryClient, directoryName, shareClient, localFilesList);
    }
}

module.exports = synchronizeProjectOnAzure;
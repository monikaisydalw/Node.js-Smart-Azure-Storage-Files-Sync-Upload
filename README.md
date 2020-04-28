# Azure Storage Files Synchronization (smart upload from a local directory)

This app allows uploading files from local directory to Azure Storage. It prepares a list to upload (all files from given root directory), compare what has been changed (by modification date) having regard to the current state on Azure target directory. It uploads all new and modified files and clean up storage directory with unwanted items (that exists on Azure only)

## Installation

Install required node modules

```bash
npm install
```

## Usage

Modify app.config file:

Give credentials to Azure Storage Account, where you want to copy your local directory in app.config file:

```
"connectionString": "",
"accountName": "",
"accountKey": "",
```

The above data you will find on Azure Portal:
Home > Storage Accounts > choose the target one > Access keys > key1

Modify test.js file:

Give local path to directory, which you want to copy file from:

```javascript
const localPath = "C:\\Users\\...."
```

## Run

To run:

```bash
node test.js
```

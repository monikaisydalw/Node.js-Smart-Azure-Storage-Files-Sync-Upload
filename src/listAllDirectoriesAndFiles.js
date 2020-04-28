const readAllDirectoriesAndFiles = function(dir, localPath, originalDirectoryName, done) {
  const fs = require('fs');
  const path = require('path');

  const getFileUpdatedDate = function(path) {
      const stats = fs.statSync(path)
      return stats.mtime;
  }

  let results = [];
  fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      let pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
          file = path.resolve(dir, file);
          fs.stat(file, function(err, stat) {
              if (stat && stat.isDirectory()) {
                  readAllDirectoriesAndFiles(file, localPath, originalDirectoryName, function(err, res) {
                      results = results.concat(res);
                      if (!--pending) done(null, results);
                  });
              } else {
                  let fileName = file.split("\\");
                  fileName = fileName[fileName.length - 1];
                  dir = dir.split("//").join("\\");
                  fileDirShorten = file.replace(localPath, "");
                  fileDirShorten = originalDirectoryName + fileDirShorten;
                  fileDirShorten = fileDirShorten.split(/\\/g).join("/");
                  fileDirShorten = fileDirShorten.replace(fileName, "");
                  fileDirShorten = fileDirShorten.substring(0, fileDirShorten.length - 1);
                  let fileModDate = getFileUpdatedDate(file);
                  results.push({
                      "name": fileName,
                      "directory": fileDirShorten,
                      "date": fileModDate
                  });

                  if (!--pending) {
                      done(null, results)
                  };
              }
          });
      });
  });

};

module.exports = readAllDirectoriesAndFiles;
"use strict";

const loadFile = require("../helpers/loadFile.js");

module.exports = (fileExtension, fileUrl)=>{

      return new Promise((resolve)=>{

            fileExtension = fileExtension.toLowerCase();

            const contentType = require("../helpers/get-content-type.js")(fileExtension);

            fileUrl = fileUrl.toLowerCase();
            
            // In this case the request is for the internal files located inside the ressources folder

            if(fileUrl.includes("files") === false ){

                  // We need to remove the pages/ folder in case where the user load the home.html page, but only for the files other than Js files

                  if(fileUrl.includes("pages") === true){

                        fileUrl = fileUrl.replace("pages/", "");
                  }

                  fileUrl = `./administration${fileUrl}`;

            }else{ 

                  fileUrl = `./${fileUrl}`;

            }

            return loadFile(fileUrl).then((file)=>{

                  return resolve({

                     Message: "File retrieved",
                     Data:{
                            
                        contentTypeValue: contentType,
                        file: file
                     }
                  
                  });

            }).catch((error)=>{ 

                  return resolve({Message: "File not retrieved"});
            })

      });
};
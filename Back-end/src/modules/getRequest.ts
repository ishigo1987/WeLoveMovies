"use strict";

module.exports = (req)=>{

    const path = require("node:path");

    const removeUrlParameters = require("../helpers/removeUrlParameters.js");

    const serveClientFile = require("./serveClientFile.js");

    const router = require("./router.js");

     return new Promise((resolve)=>{

            if(req.url === "/"){

                req.url = "/index.html";
            }

            // First we get the extension type of files waiting by the client

            const fileExtension = removeUrlParameters(path.extname(req.url).split(".").pop());

            if(fileExtension === "html"){

                const pageContent = router(removeUrlParameters(req.url), req.headers.cookie);

                return resolve({

                    Message: "Page content ok",
                    Data: pageContent
                });

               
            }

            return serveClientFile(fileExtension, req.url).then((response)=>{ 

                    if(response.Message == "File retrieved"){

                         return resolve({

                             Message: "File ok",
                             Data: {
                                  
                                 contentType: response?.Data?.contentTypeValue,
                                 file: response?.Data?.file
                             }
                         });

                    }

                    return resolve({Message: "File not retrieved"});

            });
     });
};
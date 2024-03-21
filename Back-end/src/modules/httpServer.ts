"use strict";

const fs = require("node:fs");

const controller = new AbortController();

const signal = controller.signal;

const responseHeader = require("./responseHeaders.js");

const getRequest = require("./getRequest.js");

const postRequest = require("./postRequest.js");

module.exports = (req, res)=>{

    responseHeader(res);
       
    // Right there the maximal request size is 50 MB === 52428800 Octets 

    // This limit is only for the string request
    
    const maximalRequestSize = 52428800;

    const chunks = [];

    let reqContentType = req.headers["content-type"];

    // We stream the file into an temporary file

    let temporaryFile;

    if(reqContentType !== undefined && reqContentType.includes("application/octet-stream") === true ){

          temporaryFile = `./files/temporary/file_temporary${Date.now()}`;

          const writeStream = fs.createWriteStream(temporaryFile);

          req.pipe(writeStream);
    }

    req.on("data", (chunk)=>{

        // If the user request is an upload, no need to proceed with the data envent because the request contain only the file

        if(reqContentType !== undefined && reqContentType.includes("application/octet-stream") === true ){

               return false;
        }

        chunks.push(chunk);

        if (chunks.toString('utf8').length > maximalRequestSize){

            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST

            // I put this line on comment to avoid an error of type response already sent

            // res.end(JSON.stringify({ Message: "Request limit reached" }));

            controller.abort();

            return req.client.destroy();

        }
    },{signal});
    
    req.on("end", ()=>{

         if(req.method === "GET"){

                return getRequest(req).then((response)=>{

                      if(response.Message === "Page content ok"){

                            // The ressources will be cached for 1 month

                            // res.writeHead(200,{'Cache-Control': 'max-age=2592000'});

                            res.setHeader("Content-type", "text/html");

                            return res.end(response.Data);

                      }

                      if(response.Message === "File ok"){

                            res.writeHead(200, { 'Content-Type': response?.Data?.contentType});

                            return res.end(response?.Data?.file);
                      }

                      res.writeHead(404, { 'Content-Type': `text/html`});

                      return res.end("Impossible de trouver la ressource demand&eacute;e.");

                }).catch((error)=>{

                    return res.end("Impossible de trouver la ressource demand&eacute;e.");

                });
              
         }

         if(req.method === "OPTIONS"){

                const prefligthHeaders = require("./prefligthRequest.js")();

                res.writeHead(200, prefligthHeaders);
        
                return res.end();
         }

         if(req.method === "POST"){

                const requestSettings = {
                    
                    req: req,
                    chunks: chunks,
                    temporaryFile: temporaryFile
                };

                return postRequest(requestSettings).then((response)=>{ 


                        if(response.Message === "Json not parsed"){

                             res.writeHead(200, { 'Content-Type': 'text/json' });

                             return res.end(JSON.stringify({Message: "Problem with database or request"}));
                        }

                        if(response.Message === "Problem with request"){

                            res.writeHead(200, { 'Content-Type': 'text/json' });

                            return res.end(JSON.stringify({Message: response.Data}));
                        }

                        if(response.Message === "Token expired"){

                            res.setHeader('Set-Cookie', response?.Data?.setCookieValue);

                            return res.end(JSON.stringify({Message: "Token expired"}));
                        }

                        if(response.Message === "Request is ok"){

                            const cookieValue = response?.Data?.setCookieValue;

                            if(cookieValue !== undefined){

                                res.setHeader('Set-Cookie', response?.Data?.setCookieValue);

                            }

                            res.writeHead(200, { 'Content-Type': 'text/json' });

                            return res.end(JSON.stringify(response?.Data?.responseRequest));
                        }

                });
         }

    });

    req.on('error', (err) => {

        // This prints the error message and stack trace to `stderr`.
            
        res.writeHead(400, { 'Content-Type': 'text/json' });

        return res.end(JSON.stringify({Message: "Bad request, try again"}));
    });

}

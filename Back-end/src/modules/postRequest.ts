"use strict";

module.exports = (requestSettings)=>{

     return new Promise((resolve)=>{

             const{req, chunks, temporaryFile} = requestSettings;

            const handleParseJson = require("../helpers/handleParseJson.js");

            const { StringDecoder } = require('node:string_decoder');

            const handleStringRequest =  require("./handleStringRequest.js");

            const headers = req.headers;

            let dataUser;

            const buffer = Buffer.concat(chunks); 

            if(headers["content-type"]?.includes("application/octet-stream") === true){

                dataUser = handleParseJson(headers["user-informations"]);
                
            }else{

                // The body request is a JSON stringify object

                const decoder = new StringDecoder('utf8');

                let dataRequest = decoder.write(buffer);

                dataUser = handleParseJson(dataRequest);

            }

            // We check if the data is correctly parsed, if not we return an error to the client

            if(dataUser === "Json not parsed"){

                return resolve({

                     Message: "Json not parsed"
                });

            }

            dataUser.data.authorization = headers.authorization;

            // We call the module for handle user request

            return handleStringRequest(dataUser).then((result)=>{

                if(result.Message === "Token expired"){

                    // Erase the cookie

                    // const setCookieValue = 'session=; path=/; Domain=www.magellan-transit.net; samesite=strict; secure; HttpOnly; max-age=0';

                    const setCookieValue = 'session=; max-age=0'; // To remove

                    return resolve({

                        Message: "Token expired",
                        Data:{

                            setCookieValue: setCookieValue
                        }
                   });
                }

                if(result.Message !== "All is ok"){

                    return resolve({

                        Message: "Problem with request",
                        Data: result?.Message
                    });

                }

                const{ModulePath, UserData} = result;

                delete UserData.Message;

                if(headers["content-type"]?.includes("application/octet-stream") === true){

                    UserData.temporaryFile = temporaryFile;
                    
                }

                return require(ModulePath)(UserData).then((response)=>{

                    let setCookieValue;

                    // We check if the module return some additionnals Data and if this Data contains the cookieValue key

                    if(response.Data !== undefined && response.Data.hasOwnProperty("cookieValue") === true){

                            // setCookieValue = `session=${response.Data.cookieValue}; path=/; Domain=www.magellan-transit.net; samesite=strict; secure; HttpOnly; Max-Age=604800`;
                            
                            setCookieValue = `session=${response.Data.cookieValue}; path=/; Domain=127.0.0.1; Max-Age=604800`; // To remove
                            
                            /* Domain =127.0.0.1 need to be changed by the real domain name
                            
                            Need to add secure and samesite=strict on production mode

                            Max-aAge = 604800 , means the cookie expire after one week
                            
                            */

                            delete response.Data.cookieValue;
                    }

                    if(response.Data !== undefined && response.Data.hasOwnProperty("cookieErased") === true){

                            // Erase the cookie

                            // setCookieValue = 'session=; path=/; Domain=www.magellan-transit.net; samesite=strict; secure; HttpOnly; max-age=0';

                            setCookieValue = 'session=; path=/; Domain=127.0.0.1; max-age=0'; // To remove

                    }

                    return resolve({

                         Message: "Request is ok",
                         Data:{

                             setCookieValue: setCookieValue,
                             responseRequest: response
                         }
                    });


                });

            });
     });
    
};
"use strict";

module.exports = (userData)=>{

  return new Promise((resolve)=>{

      require('../helpers/checkDataTextIntegrity.js')(userData).then((response)=>{
            
            if(response.Message === "Tout est ok"){

                // Check if the requestName is correct

                if(require("../helpers/checkUserRequestName.js")(userData?.requestName) === false){ 

                    return resolve({Message: "Le nom de votre requête n'est pas bon, veuillez le vérifier."});
                }

                // Check that if the user does not send an html, first of all we need to transform to an array all the object values, and sanitize

                if(userData.data !== null){

                    // Check if the user JWToken is valid

                    return require("../helpers/checkTokenValidity.js")(userData?.data?.authorization, userData?.requestName).then((tokenResponse)=>{ 

                        if(["Token pas encore présent", "Bon Token"].includes(tokenResponse.Message) === true){

                            // userRole can be administrator or supplier

                            let userRole;

                            if(tokenResponse.Message === "Bon Token"){

                                // We get the token payload informations

                                userData.data.userId = tokenResponse?.Data?.userId;

                                userData.data.email =  tokenResponse?.Data?.email;

                                userData.data.fullname = tokenResponse?.Data?.fullname;

                                userRole = tokenResponse?.Data?.userRole;
    
                            }

                            // We remove the authorization key, it's not useful anynore

                            delete  userData.data.authorization;

                            // In this case the user does not have a token (by example the user made inscription request)

                            if(tokenResponse.Message === "Token pas encore présent"){

                                 userRole = userData?.data?.userRole;

                                 userData.data.fullname = userData?.data?.fullname;

                            }

                            // We sanitize all the front-end informations

                            const objectEntries = Object.entries(userData.data);

                            return require("../helpers/sanitizeHtml.js")(objectEntries).then((result)=>{

                                userData.data = Object.fromEntries(result);

                                // The user can continue with his request

                                let modulePath;

                                if(userRole === "administrator"){

                                    modulePath = `../modules/administrators/${userData?.requestName}.js`;

                                }else if(userRole === "users"){

                                    modulePath = `../modules/users/${userData?.requestName}.js`;

                                }else{

                                    return resolve({

                                         Message: "Erreur lors de l'exécution de votre requête."
                                    });
                                }

                                return resolve({

                                    Message: "All is ok",
                                    ModulePath: modulePath,
                                    UserData: userData?.data
                                });
                                
        
                            });
                           

                        }
            
                        return resolve(tokenResponse);

                    });

                }
                
                
            }

            return resolve(response);

      });
  });
};

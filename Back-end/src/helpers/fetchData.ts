"use strict";

module.exports = (url, options)=>{

    return new Promise((resolve, reject)=>{

            const fetch = require('node-fetch');

            return fetch(url, options).then((response)=>{

                return response.json();

            }).then((result)=>{

                return resolve(result);

            }).catch((error)=>{

                reject({Message: "Requête non aboutie"});

            });
    });
}